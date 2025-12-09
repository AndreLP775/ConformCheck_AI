import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('norma')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/normas',
        filename: (req, file, callback) => {
          const nomeOriginal = file.originalname.replace(/\s+/g, '_');
          const safeName = Buffer.from(nomeOriginal, 'latin1').toString('utf8');
          const nomeFinal = `${Date.now()}_${safeName}`;
          callback(null, nomeFinal);
        },
      }),
      fileFilter: (req, file, callback) => {
        const extensao = extname(file.originalname).toLowerCase();
        if (extensao !== '.pdf' && extensao !== '.docx') {
          return callback(
            new BadRequestException('Apenas arquivos .pdf ou .docx são permitidos'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadNorma(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');

    console.log('📄 Arquivo salvo:', file.filename);

    // Chama o Python
    const resultadoIA = await this.uploadService.enviarParaIA(
      file.path, 
      file.originalname
    );


    return {
      message: 'Sucesso',
      arquivo_sistema: file.filename,
      ...resultadoIA // <--- Isso "desembrulha" as perguntas direto na raiz
    };
  }

  @Post('evidencia')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/normas', // Podemos salvar na mesma pasta por enquanto
        filename: (req, file, callback) => {
          const nomeFinal = `EVIDENCIA_${Date.now()}_${file.originalname}`;
          callback(null, nomeFinal);
        },
      }),
    }),
  )
  async uploadEvidencia(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    // No NestJS, para ler campos de texto (como 'pergunta') junto com arquivo,
    // usamos req.body.pergunta (pois o multer processa o form-data)
    const perguntaTexto = req.body.pergunta;

    if (!file || !perguntaTexto) {
      throw new BadRequestException('Arquivo e Pergunta são obrigatórios');
    }

    console.log('📄 Evidência recebida para a pergunta:', perguntaTexto);

    const resultado = await this.uploadService.enviarEvidenciaParaAnalise(
      file.path,
      perguntaTexto
    );

    return resultado;
  }
}