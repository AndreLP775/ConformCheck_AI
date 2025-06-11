import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-norma',
  templateUrl: './upload-norma.component.html',
  styleUrls: ['./upload-norma.component.css']
})
export class UploadNormaComponent {

mensagem: string = '';


selectedFile: File | null = null;

onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const extensao = file.name.split('.').pop()?.toLowerCase();
    const extensoesPermitidas = ['pdf', 'docx'];

    if (extensao && extensoesPermitidas.includes(extensao)) {
      this.selectedFile = file;
      this.mensagem = `Arquivo válido selecionado: ${file.name}`;
    } else {
      this.selectedFile = null;
      this.mensagem = 'Por favor, selecione um arquivo nos formatos PDF ou DOCX.';
    }
  }
}


enviarArquivo(): void {
    if (this.selectedFile) {
      console.log('Enviando arquivo:', this.selectedFile.name);
      // Aqui futuramente vamos fazer o upload real
    } else {
      console.log('Nenhum arquivo selecionado.');
    }
}

limparArquivo(): void {
  this.selectedFile = null;
  this.mensagem = '';
}


}
