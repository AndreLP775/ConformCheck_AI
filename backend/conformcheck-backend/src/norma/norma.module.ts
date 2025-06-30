import { Module } from '@nestjs/common';
import { NormaController } from './norma.controller';
import { NormaService } from './norma.service';

@Module({
  controllers: [NormaController],
  providers: [NormaService]
})
export class NormaModule {}
