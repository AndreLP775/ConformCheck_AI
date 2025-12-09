import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  // Aqui definimos que o nome é 'httpService'
  constructor(private readonly httpService: HttpService) {}

  async enviarParaIA(caminhoArquivo: string, nomeOriginal: string) {
    try {
      const data = new FormData();
      data.append('file', fs.createReadStream(caminhoArquivo), nomeOriginal);

      console.log('🚀 Enviando arquivo para IA-Engine (Python)...');

      // Aqui usamos this.httpService (correto)
      const respostaObservable = this.httpService.post('http://127.0.0.1:8000/gerar-checklist-pdf', data, {
        headers: { ...data.getHeaders() },
      });

      const resposta: any = await lastValueFrom(respostaObservable);
      const dadosIA = resposta.data;

      this.salvarChecklistEmDisco(nomeOriginal, dadosIA);

      console.log('✅ Resposta da IA recebida e salva!');
      return dadosIA;

    } catch (error) {
      console.error('❌ Erro ao conectar com a IA:', error.message);
      throw new HttpException(
        'Erro ao processar arquivo na IA',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // --- CORREÇÃO APLICADA NESTA FUNÇÃO ---
  async enviarEvidenciaParaAnalise(caminhoArquivo: string, pergunta: string) {
    try {
      const data = new FormData();
      data.append('file', fs.createReadStream(caminhoArquivo));
      data.append('pergunta', pergunta);

      console.log('🔎 Enviando evidência para análise na IA...');

      // 1. Correção: Usar 'this.httpService' (igual ao construtor)
      const respostaObservable = this.httpService.post('http://127.0.0.1:8000/analisar-evidencia', data, {
          headers: { ...data.getHeaders() },
      });

      // 2. Correção: Tipar como 'any' para evitar erro de 'unknown'
      const resposta: any = await lastValueFrom(respostaObservable);

      return resposta.data; // Retorna { "resposta": "CONFORME: ..." }

    } catch (error) {
      console.error('❌ Erro na análise de evidência:', error.message);
      throw new HttpException('Erro ao analisar evidência', HttpStatus.BAD_GATEWAY);
    }
  }

  private salvarChecklistEmDisco(nomeOriginal: string, dados: any) {
    try {
      const nomeBase = path.parse(nomeOriginal).name;
      const caminhoSalvar = path.join(process.cwd(), 'database', `checklist_${nomeBase}.json`);
      
      const dadosParaSalvar = {
        ...dados,
        data_criacao: new Date().toISOString(),
        nome_norma: nomeOriginal
      };

      if (!fs.existsSync(path.dirname(caminhoSalvar))) {
          fs.mkdirSync(path.dirname(caminhoSalvar), { recursive: true });
      }

      fs.writeFileSync(caminhoSalvar, JSON.stringify(dadosParaSalvar, null, 2));
      console.log(`💾 Checklist salvo em: ${caminhoSalvar}`);
    } catch (erro) {
      console.error('Erro ao salvar checklist no disco:', erro);
    }
  }
}