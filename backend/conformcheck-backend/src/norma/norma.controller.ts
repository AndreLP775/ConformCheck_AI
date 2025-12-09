import { Controller, Get, Delete, Param } from '@nestjs/common';
import { NormaService } from './norma.service';

@Controller('normas')
export class NormaController {
  constructor(private readonly normaService: NormaService) {}

  // --- Rotas de PDFs ---
  @Get()
  getNormas(): string[] {
    return this.normaService.getNormas();
  }

  @Delete(':fileName')
  deleteNorma(@Param('fileName') fileName: string): string {
    return this.normaService.deleteNorma(fileName);
  }

  // --- NOVAS ROTAS: Checklists ---
  
  // Rota: GET /normas/checklists -> Lista todos os questionários salvos
  @Get('checklists/todos')
  getChecklists(): string[] {
    return this.normaService.listarChecklists();
  }

  // Rota: GET /normas/checklists/arquivo.json -> Abre um específico
  @Get('checklists/:fileName')
  getChecklistUnico(@Param('fileName') fileName: string): any {
    return this.normaService.carregarChecklist(fileName);
  }
}