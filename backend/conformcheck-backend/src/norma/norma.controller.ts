import { Controller, Get, Delete, Param, NotFoundException } from '@nestjs/common';
import { NormaService } from './norma.service';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Controller('normas')
export class NormaController {
  constructor(private readonly normaService: NormaService) {}

  @Get()
  getNormas(): string[] {
    return this.normaService.getNormas();
  }

  @Delete(':fileName')
  deleteNorma(@Param('fileName') fileName: string): string {
    return this.normaService.deleteNorma(fileName);
  }
}
