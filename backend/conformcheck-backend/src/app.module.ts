import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { NormaModule } from './norma/norma.module';

@Module({
  imports: [UploadModule, NormaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
