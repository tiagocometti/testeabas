import { Component, Input } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IAbasComponent } from '../interfaces/interfaces';
import { CommonModule } from '@angular/common'; // Adicionado aqui

@Component({
  selector: 'empresa',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css',
})
export class EmpresaComponent implements IAbasComponent {
  inputControl: FormControl;
  @Input() EstaAtivo: boolean = true;

    // Dados estáticos para simular resultados de pesquisa
    dadosEmpresas = [
      { razsocial: 'Empresa X', faixa: 2, cnpj: '1234567890001' },
      { razsocial: 'Empresa Y', faixa: 6, cnpj: '9876543210001' },
    ];
  
    resultadoPesquisa: { razsocial: string; faixa: number; cnpj: string } | null = null;

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
      this.resultadoPesquisa = this.dadosEmpresas.find(
        (empresa) => empresa.razsocial.toLowerCase() === nomePesquisado.toLowerCase()
      ) || null;
    } else {
      this.resultadoPesquisa = null; // Nenhum resultado encontrado
    }
  }
}
