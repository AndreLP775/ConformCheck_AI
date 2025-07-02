import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-listar-normas',
  templateUrl: './listar-normas.component.html',
  styleUrls: ['./listar-normas.component.css']
})
export class ListarNormasComponent implements OnInit {
  normas: string[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarNormas();
  }

  carregarNormas(): void {
    this.loading = true;
    this.http.get<string[]>('http://localhost:3000/normas').subscribe({
      next: (dados) => {
        this.normas = dados;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar normas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteNorma(fileName: string): void {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir o arquivo "${fileName}"?`);
    if (!confirmacao) return;

    this.http.delete(`http://localhost:3000/normas/${fileName}`, { responseType: 'text' }).subscribe({
      next: () => {
        alert('Arquivo excluído com sucesso.');
        this.carregarNormas();  // Atualiza a lista
      },
      error: err => {
        console.error('Erro ao excluir:', err);
        alert('Erro ao excluir o arquivo.');
      }
  });
  }

}
