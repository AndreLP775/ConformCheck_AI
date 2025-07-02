import { Component, ViewChild } from '@angular/core';
import { ListarNormasComponent } from './components/listar-normas/listar-normas.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(ListarNormasComponent) listarNormasComponent?: ListarNormasComponent;

  onUploadConcluido(): void {
    this.listarNormasComponent?.carregarNormas();
  }
}
