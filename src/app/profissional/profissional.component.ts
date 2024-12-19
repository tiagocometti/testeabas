import { Component, Input } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Adicionado aqui
import { IAbasComponent } from '../interfaces/interfaces';
import { AbasService } from '../services/abas.service';
import { Router } from '@angular/router'; // Adicionado para manipular rotas

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

  lastFunctionality: string = ''; // Adicionado para armazenar a funcionalidade atual

  // Dados estáticos para simular resultados de pesquisa
  dadosProfissionais = [
    { nome: 'João', titulo: 'Engenheiro Mecânico', cpf: '123456789' },
    { nome: 'Maria', titulo: 'Engenheiro Civil', cpf: '987654321' },
  ];

  resultadoPesquisa: { nome: string; titulo: string; cpf: string } | null =
    null;

  constructor(
    fb: FormBuilder,
    private abasService: AbasService,
    private router: Router
  ) {
    this.inputControl = fb.control('');
  }

  PodeFechar(): boolean {
    if (this.inputControl.value !== '') return true;
    else return false;
  }

  realizarPesquisa() {
    const nomePesquisado = this.inputControl.value.trim();
    const abaId = this.router.url.split('/')[1]; // Extrai o uniqueCode da URL

    if (nomePesquisado) {
      this.resultadoPesquisa =
        this.dadosProfissionais.find(
          (profissional) =>
            profissional.nome.toLowerCase() === nomePesquisado.toLowerCase()
        ) || null;

      // Atualiza o estado e o endereço com o nome pesquisado (mesmo se não encontrado)
      this.lastFunctionality = nomePesquisado;
      this.router.navigate([`/${abaId}`, nomePesquisado]); // Exemplo: /profissional-0/joao
    } else {
      // Se o input está vazio, reseta para apenas o uniqueCode
      this.resultadoPesquisa = null;
      this.router.navigate([`/${abaId}`]); // Exemplo: /profissional-0
    }
  }
}
