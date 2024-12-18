import { Component, Input } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Adicionado aqui
import { IAbasComponent } from '../interfaces/interfaces';
import { AbasService } from '../services/abas.service';

@Component({
  selector: 'profissional',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profissional.component.html',
  styleUrl: './profissional.component.css',
})
export class ProfissionalComponent implements IAbasComponent {
  inputControl: FormControl;
  @Input() EstaAtivo: boolean = true;

  // Dados estáticos para simular resultados de pesquisa
  dadosProfissionais = [
    { nome: 'João', titulo: 'Engenheiro Mecânico', cpf: '123456789' },
    { nome: 'Maria', titulo: 'Engenheiro Civil', cpf: '987654321' },
  ];

  resultadoPesquisa: { nome: string; titulo: string; cpf: string } | null = null;

  constructor(fb: FormBuilder, private abasService: AbasService) {
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
      this.resultadoPesquisa = this.dadosProfissionais.find(
        (profissional) => profissional.nome.toLowerCase() === nomePesquisado.toLowerCase()
      ) || null;
    } else {
      this.resultadoPesquisa = null; // Nenhum resultado encontrado
    }
  }
}
