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
  if (!this.selectedFile) {
    this.mensagem = 'Nenhum arquivo selecionado.';
    return;
  }

  const formData = new FormData();
  formData.append('file', this.selectedFile);

fetch('/upload/norma', {
  method: 'POST',
  body: formData,
})

    .then(async (res) => {
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }
      return res.json();
    })
    .then((data) => {
      this.mensagem = `✅ Arquivo enviado com sucesso: ${data.filename}`;
      this.selectedFile = null;
    })
    .catch((error) => {
      this.mensagem = `❌ Erro ao enviar arquivo: ${error.message}`;
    });
}


limparArquivo(): void {
  this.selectedFile = null;
  this.mensagem = '';
}


}
