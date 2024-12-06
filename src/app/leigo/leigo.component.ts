import { Component, Input } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Adicionado aqui
import { IAbasComponent } from '../interfaces/interfaces';

@Component({
  selector: 'leigo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './leigo.component.html',
  styleUrl: './leigo.component.css',
})
export class LeigoComponent implements IAbasComponent {
  inputControl: FormControl;
  @Input() EstaAtivo: boolean = true;

      // Dados estáticos para simular resultados de pesquisa
      dadosLeigos = [
        { nome: 'José', cpf: '456789123', cnpj: '-' },
        { nome: 'Empresa Z', cpf: '-', cnpj: '45687210001' },
      ];
    
      resultadoPesquisa: { nome: string; cpf: string; cnpj: string } | null = null;

  constructor(fb: FormBuilder) {
    this.inputControl = fb.control('');
  }

  PodeFechar(): boolean {
    if (this.inputControl.value !== '' ) return true;
    else return false;
  }

  realizarPesquisa() {
    const nomePesquisado = this.inputControl.value.trim();
    if (nomePesquisado) {
      // Simula a pesquisa nos dados estáticos
      this.resultadoPesquisa = this.dadosLeigos.find(
        (leigo) => leigo.nome.toLowerCase() === nomePesquisado.toLowerCase()
      ) || null;
    } else {
      this.resultadoPesquisa = null; // Nenhum resultado encontrado
    }
  }

}
