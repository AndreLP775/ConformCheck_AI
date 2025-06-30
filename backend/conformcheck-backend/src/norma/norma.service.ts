import { Injectable, NotFoundException } from '@nestjs/common';
import { readdirSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class NormaService {
  getNormas(): string[] {
    const path = join(__dirname, '..', '..', 'uploads', 'normas');
    if (!existsSync(path)) {
      return [];
    }
    return readdirSync(path);
  }

  deleteNorma(fileName: string): void {
    const path = join(__dirname, '..', '..', 'uploads', 'normas', fileName);
    if (!existsSync(path)) {
      throw new NotFoundException('Norma não encontrada');
    }
    unlinkSync(path);
  }
}
