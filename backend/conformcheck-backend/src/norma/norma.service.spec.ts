import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NormaService {
  private readonly databasePath = path.join(process.cwd(), 'database');
  private readonly normasPath = path.join(process.cwd(), 'uploads/normas');

  // --- Funções de Normas (PDFs) ---
  getNormas(): string[] {
    if (!fs.existsSync(this.normasPath)) return [];
    return fs.readdirSync(this.normasPath);
  }

  deleteNorma(fileName: string): string {
    const filePath = path.join(this.normasPath, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return `Norma ${fileName} removida com sucesso.`;
    }
    return 'Arquivo não encontrado.';
  }

  extrairConteudo(fileName: string): string {
    return 'Conteúdo simulado por enquanto.';
  }

  // --- NOVAS FUNÇÕES: Questionários (Checklists) ---

  listarChecklists(): string[] {
    // Cria a pasta database se não existir
    if (!fs.existsSync(this.databasePath)) {
      fs.mkdirSync(this.databasePath);
    }
    
    // Retorna lista de arquivos .json
    return fs.readdirSync(this.databasePath).filter(file => file.endsWith('.json'));
  }

  carregarChecklist(fileName: string): any {
    const filePath = path.join(this.databasePath, fileName);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Checklist não encontrado');
    }
    const conteudo = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(conteudo);
  }
}