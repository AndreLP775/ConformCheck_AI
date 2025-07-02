import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { existsSync, unlinkSync, readdirSync } from 'fs';

@Injectable()
export class NormaService {
  getNormas(): string[] {
    const dirPath = join(__dirname, '..', '..', 'uploads', 'normas');
    return readdirSync(dirPath);
  }

deleteNorma(fileName: string): string {
  const decodedFileName = decodeURIComponent(fileName);
  const filePath = join(__dirname, '..', '..', 'uploads', 'normas', decodedFileName);

  if (existsSync(filePath)) {
    unlinkSync(filePath);
    return 'Arquivo excluído com sucesso.';
  } else {
    throw new NotFoundException(`Arquivo "${decodedFileName}" não encontrado.`);
  }
}
}