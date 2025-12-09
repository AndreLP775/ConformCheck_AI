import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ChecklistItem {
  id: number;
  pergunta: string;
  resposta: string;
  tipo: string;
  status: 'pendente' | 'conforme' | 'nao_conforme';
  analisando?: boolean; // Novo campo para controlar o loading individual
}

@Component({
  selector: 'app-upload-norma',
  templateUrl: './upload-norma.component.html',
  styleUrls: ['./upload-norma.component.css']
})
export class UploadNormaComponent implements OnInit {

  mensagem: string = '';
  selectedFile: File | null = null;
  checklist: ChecklistItem[] = [];
  questionariosSalvos: string[] = [];
  questionarioAtivo: string = '';

  @Output() uploadConcluido = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.atualizarListaSalva();
  }

  atualizarListaSalva() {
    this.http.get<string[]>('http://localhost:3000/normas/checklists/todos').subscribe({
      next: (lista) => this.questionariosSalvos = lista,
      error: (erro) => console.error('Erro lista:', erro)
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && ['pdf', 'docx'].includes(file.name.split('.').pop()?.toLowerCase() || '')) {
      this.selectedFile = file;
      this.mensagem = `Arquivo: ${file.name}`;
    } else {
      this.mensagem = 'Apenas PDF ou DOCX.';
    }
  }

  enviarArquivo(): void {
    if (!this.selectedFile) return;
    this.mensagem = '⏳ IA criando checklist...';
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>('http://localhost:3000/upload/norma', formData).subscribe({
      next: (data) => {
        const nome = data.nome_arquivo || data.arquivo_sistema || 'Checklist';
        this.mensagem = `✅ Criado: ${nome}`;
        this.processarDadosUnificados(data);
        this.atualizarListaSalva();
        this.selectedFile = null;
        this.uploadConcluido.emit();
      },
      error: (err) => this.mensagem = `❌ Erro: ${err.message}`
    });
  }

  carregarChecklistSalvo(nome: string): void {
    this.mensagem = `📂 Carregando ${nome}...`;
    this.http.get<any>(`http://localhost:3000/normas/checklists/${nome}`).subscribe({
      next: (data) => {
        this.questionarioAtivo = nome;
        this.processarDadosUnificados(data);
        this.mensagem = `Carregado: ${data.nome_norma || nome}`;
      },
      error: (err) => this.mensagem = `❌ Erro: ${err.message}`
    });
  }

  // --- NOVA FUNÇÃO: UPLOAD DE EVIDÊNCIA (RAG) ---
  uploadEvidencia(event: any, item: ChecklistItem) {
    const file = event.target.files[0];
    if (!file) return;

    // Ativa o loading só neste item
    item.analisando = true;
    item.resposta = '⏳ A IA está lendo o arquivo de evidência e comparando com a pergunta...';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pergunta', item.pergunta); // Manda a pergunta junto!

    this.http.post<any>('http://localhost:3000/upload/evidencia', formData).subscribe({
      next: (data) => {
        // A IA devolve { "resposta": "CONFORME: O documento x..." }
        item.resposta = data.resposta;
        item.analisando = false;
        
        // Define status visual básico
        if (data.resposta.includes('NÃO CONFORME')) item.status = 'nao_conforme';
        else if (data.resposta.includes('CONFORME')) item.status = 'conforme';
      },
      error: (err) => {
        item.resposta = `❌ Erro na análise: ${err.message}`;
        item.analisando = false;
      }
    });
  }

  private processarDadosUnificados(data: any) {
    const lista = data.perguntas || (data.ia_response ? data.ia_response.perguntas : []);
    this.checklist = lista.map((item: any, i: number) => ({
      id: i + 1,
      pergunta: item.pergunta,
      tipo: item.tipo || 'Geral',
      resposta: item.resposta || '',
      status: 'pendente',
      analisando: false
    }));
  }

  limparArquivo(): void {
    this.selectedFile = null;
    this.mensagem = '';
    this.checklist = [];
    this.questionarioAtivo = '';
  }
}