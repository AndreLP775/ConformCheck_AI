import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { HttpModule } from '@nestjs/axios'; // Importa o módulo HTTP

@Module({
  imports: [HttpModule], // Habilita o uso de requisições HTTP neste módulo
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}