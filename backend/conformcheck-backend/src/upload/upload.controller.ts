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

@Controller('upload')
export class UploadController {
  @Post('norma')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/normas',
        filename: (req, file, callback) => {
          const nomeOriginal = file.originalname.replace(/\s+/g, '_');
          const extensao = extname(file.originalname);
          const nomeFinal = `${Date.now()}_${nomeOriginal}`;
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
  uploadNorma(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    console.log('📥 Headers recebidos:', req.headers);
    console.log('📄 Arquivo recebido:', file);

    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    return {
      message: 'Arquivo recebido com sucesso',
      filename: file.filename,
    };
  }
}
