import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private readonly httpService: HttpService) {}

  async enviarParaIA(caminhoArquivo: string, nomeOriginal: string) {
    try {
      // 1. Prepara envio para o Python
      const data = new FormData();
      data.append('file', fs.createReadStream(caminhoArquivo), nomeOriginal);

      console.log('🚀 Enviando arquivo para IA-Engine (Python)...');

      // 2. Chama a IA
      const resposta = await lastValueFrom(
        this.httpService.post('http://127.0.0.1:8000/gerar-checklist-pdf', data, {
          headers: { ...data.getHeaders() },
        }),
      );

      const dadosIA = resposta.data;

      // 3. SALVAR NO DISCO (A NOVA MEMÓRIA)
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

  private salvarChecklistEmDisco(nomeOriginal: string, dados: any) {
    try {
      // Remove extensão .pdf ou .docx para usar no nome do JSON
      const nomeBase = path.parse(nomeOriginal).name;
      // Define o caminho: database/checklist_NOME.json
      const caminhoSalvar = path.join(process.cwd(), 'database', `checklist_${nomeBase}.json`);
      
      // Adiciona data de criação aos dados
      const dadosParaSalvar = {
        ...dados,
        data_criacao: new Date().toISOString(),
        nome_norma: nomeOriginal
      };

      // Escreve o arquivo
      fs.writeFileSync(caminhoSalvar, JSON.stringify(dadosParaSalvar, null, 2));
      console.log(`💾 Checklist salvo em: ${caminhoSalvar}`);
    } catch (erro) {
      console.error('Erro ao salvar checklist no disco:', erro);
      // Não quebramos a aplicação se falhar ao salvar, apenas logamos
    }
  }
}