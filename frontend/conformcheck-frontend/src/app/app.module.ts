import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'; // <--- OBRIGATÓRIO para usar [(ngModel)]

// --- Módulos do Angular Material ---
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';       // Para a lista lateral
import { MatDividerModule } from '@angular/material/divider'; // Para as linhas divisórias
import { MatExpansionModule } from '@angular/material/expansion'; // Para o efeito sanfona (acordeão)

import { AppComponent } from './app.component';
import { UploadNormaComponent } from './components/upload-norma/upload-norma.component';
import { ListarNormasComponent } from './components/listar-normas/listar-normas.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadNormaComponent,
    ListarNormasComponent
  ],
  imports: [
    // Módulos Básicos do Angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, // <--- Adicionado aqui também

    // Módulos Visuais (Material)
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }