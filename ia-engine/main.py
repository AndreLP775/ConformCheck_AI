from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os
import pypdf
import io
import json

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

def extract_text_from_pdf(file_content: bytes) -> str:
    try:
        pdf_reader = pypdf.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Erro ao ler PDF: {e}")
        return ""

@app.post("/gerar-checklist-pdf")
async def gerar_checklist_pdf(file: UploadFile = File(...)):
    print(f"Processando norma: {file.filename}")
    content = await file.read()
    texto_norma = extract_text_from_pdf(content)
    texto_para_ia = texto_norma[:30000] 

    prompt = f"""
    Atue como Auditor Líder. Extraia requisitos da norma abaixo para um checklist.
    Saída JSON obrigatória: {{ "itens": [ {{ "pergunta": "...", "tipo": "Obrigatório" | "Recomendável" | "Geral" }} ] }}
    
    Norma:
    {texto_para_ia}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={ "type": "json_object" },
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        dados = json.loads(response.choices[0].message.content)
        return {"nome_arquivo": file.filename, "perguntas": dados.get("itens", [])}
    except Exception as e:
        return {"erro": str(e)}

# --- NOVA ROTA: RAG (Análise de Evidência) ---
@app.post("/analisar-evidencia")
async def analisar_evidencia(
    file: UploadFile = File(...), 
    pergunta: str = Form(...)
):
    print(f"Analisando evidência para a pergunta: {pergunta}")
    
    # 1. Ler o PDF da evidência
    content = await file.read()
    texto_evidencia = extract_text_from_pdf(content)
    
    # Corte de segurança (se a evidência for gigante)
    texto_evidencia = texto_evidencia[:20000]

    if not texto_evidencia.strip():
        return {"resposta": "Não foi possível ler texto neste arquivo de evidência (pode ser imagem escaneada)."}

    # 2. Prompt de Auditoria (RAG Simplificado)
    prompt = f"""
    Você é um auditor verificando uma evidência.
    
    PERGUNTA DO CHECKLIST: "{pergunta}"
    
    CONTEÚDO DO DOCUMENTO DE EVIDÊNCIA:
    "{texto_evidencia}"
    
    TAREFA:
    Analise se o documento fornecido responde ou atende à pergunta do checklist.
    - Se atender, explique COMO atende e cite trechos do texto.
    - Se NÃO atender, explique o que falta.
    - Seja direto e objetivo. Inicie com "CONFORME:" ou "NÃO CONFORME:" ou "PARCIAL:".
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        analise = response.choices[0].message.content
        return {"resposta": analise}
        
    except Exception as e:
        return {"resposta": f"Erro na análise: {str(e)}"}