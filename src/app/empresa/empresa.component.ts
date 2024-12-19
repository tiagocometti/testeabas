import { Component, Input } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IAbasComponent } from '../interfaces/interfaces';
import { CommonModule } from '@angular/common'; // Adicionado aqui
import { Router } from '@angular/router'; // Adicionado para manipular rotas

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

  lastFunctionality: string = ''; // Adicionado para armazenar a funcionalidade atual

    // Dados estáticos para simular resultados de pesquisa
    dadosEmpresas = [
      { razsocial: 'Empresa X', faixa: 2, cnpj: '1234567890001' },
      { razsocial: 'Empresa Y', faixa: 6, cnpj: '9876543210001' },
    ];
  
    resultadoPesquisa: { razsocial: string; faixa: number; cnpj: string } | null = null;

  constructor(fb: FormBuilder, private router: Router) {
    this.inputControl = fb.control('');
    
  }

  PodeFechar(): boolean {
    if (this.inputControl.value !== '' ) return true;
    else return false;
  }

  realizarPesquisa() {
    const empPesquisada = this.inputControl.value.trim();
    const abaId = this.router.url.split('/')[1]; // Extrai o uniqueCode da URL

    if (empPesquisada) {
      this.resultadoPesquisa =
        this.dadosEmpresas.find(
          (empresa) =>
            empresa.razsocial.toLowerCase() === empPesquisada.toLowerCase()
        ) || null;

      // Atualiza o estado e o endereço com o nome pesquisado (mesmo se não encontrado)
      this.lastFunctionality = empPesquisada;
      this.router.navigate([`/${abaId}`, empPesquisada]); // Exemplo: /profissional-0/joao
    } else {
      // Se o input está vazio, reseta para apenas o uniqueCode
      this.resultadoPesquisa = null;
      this.router.navigate([`/${abaId}`]); // Exemplo: /profissional-0
    }
  }
}
