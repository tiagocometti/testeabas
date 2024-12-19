import { Component, Input } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Adicionado aqui
import { IAbasComponent } from '../interfaces/interfaces';
import { Router } from '@angular/router'; // Adicionado para manipular rotas

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
  lastFunctionality: string = ''; // Adicionado para armazenar a funcionalidade atual

      // Dados estáticos para simular resultados de pesquisa
      dadosLeigos = [
        { nome: 'José', cpf: '456789123', cnpj: '-' },
        { nome: 'Empresa Z', cpf: '-', cnpj: '45687210001' },
      ];
    
      resultadoPesquisa: { nome: string; cpf: string; cnpj: string } | null = null;

  constructor(fb: FormBuilder, private router: Router) {
    this.inputControl = fb.control('');
  }

  PodeFechar(): boolean {
    if (this.inputControl.value !== '' ) return true;
    else return false;
  }

  realizarPesquisa() {
    const leigoPesquisado = this.inputControl.value.trim();
    const abaId = this.router.url.split('/')[1]; // Extrai o uniqueCode da URL

    if (leigoPesquisado) {
      this.resultadoPesquisa =
        this.dadosLeigos.find(
          (leigo) =>
            leigo.nome.toLowerCase() === leigoPesquisado.toLowerCase()
        ) || null;

      // Atualiza o estado e o endereço com o nome pesquisado (mesmo se não encontrado)
      this.lastFunctionality = leigoPesquisado;
      this.router.navigate([`/${abaId}`, leigoPesquisado]); // Exemplo: /profissional-0/joao
    } else {
      // Se o input está vazio, reseta para apenas o uniqueCode
      this.resultadoPesquisa = null;
      this.router.navigate([`/${abaId}`]); // Exemplo: /profissional-0
    }
  }

}
