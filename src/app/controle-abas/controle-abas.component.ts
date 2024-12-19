import {
  Component,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  Type,
} from '@angular/core';
import { CommonModule } from '@angular/common'; // Importando o CommonModule
import { ItemAbasHeaderComponent } from '../item-abas-header/item-abas-header.component';
import { ProfissionalComponent } from '../profissional/profissional.component';
import { EmpresaComponent } from '../empresa/empresa.component';
import { LeigoComponent } from '../leigo/leigo.component';
import { Subscription } from 'rxjs';
import { IAbas, IAbasComponent } from '../interfaces/interfaces';
import { AbasService } from '../services/abas.service';
import { ModalService } from '../services/modal.service';
import { Router } from '@angular/router'; // Adicionado para navegação dinâmica

@Component({
  selector: 'controle-abas',
  standalone: true,
  imports: [
    ItemAbasHeaderComponent,
    ProfissionalComponent,
    EmpresaComponent,
    LeigoComponent,
    CommonModule,
  ],
  templateUrl: './controle-abas.component.html',
  styleUrl: './controle-abas.component.css',
})
export class ControleAbasComponent implements OnDestroy {
  itemAbasSubscription: Subscription;
  indice: number = 0;
  abas: IAbas[] = [];
  @ViewChild('containerRef', { read: ViewContainerRef, static: true })
  containerRef!: ViewContainerRef;

  constructor(
    private abasService: AbasService,
    private modalService: ModalService,
    private router: Router // Adicionado para navegação dinâmica
  ) {
    this.itemAbasSubscription = abasService.itemAbaObservable.subscribe({
      next: (res: string) => {
        this.addNovaAba(res);
      },
      error: (err) => {
        console.log(err);
      },
    });

    // Verifica se não há abas ativas ao carregar
    if (this.abas.length === 0) {
      this.router.navigate(['/']); // Redireciona para a raiz
    }
  }

  ngOnDestroy(): void {
    this.itemAbasSubscription.unsubscribe();
  }

  addNovaAba(code: string) {
    var uniqueCode = code + '-' + this.indice;
    this.indice++;

    this.containerRef.detach();
    var component = this.containerRef.createComponent(
      this.getTipoComponent(code)
    );
    component.instance.EstaAtivo = true;
    this.containerRef.get(0);

    for (let aba of this.abas) {
      aba.conteudo.instance.EstaAtivo = false;
    }

    this.abas.unshift({
      header: code,
      uniqueCode: uniqueCode,
      conteudo: component,
      view: this.containerRef.get(0)!,
    });

    // Atualiza o endereço com apenas o uniqueCode (sem funcionalidade inicial)
    this.router.navigate([`/${uniqueCode}`]); // Exemplo: /profissional-0
  }

  getTipoComponent(code: string): Type<any> {
    var tipo: Type<any> = ProfissionalComponent;
    switch (code) {
      case 'profissional':
        tipo = ProfissionalComponent;
        break;
      case 'empresa':
        tipo = EmpresaComponent;
        break;
      case 'leigo':
        tipo = LeigoComponent;
        break;
    }
    return tipo;
  }

  selecionarAba(uniqueCode: string) {
    for (let aba of this.abas) {
      if (aba.uniqueCode === uniqueCode) {
        aba.conteudo.instance.EstaAtivo = true;
        this.containerRef.detach();
        this.containerRef.insert(aba.view);

        // Atualiza o endereço com o uniqueCode e a funcionalidade (se houver)
        const functionality = aba.conteudo.instance.lastFunctionality || '';
        this.router.navigate([`/${uniqueCode}`, functionality]); // Exemplo: /profissional-0/joao
      } else {
        aba.conteudo.instance.EstaAtivo = false;
      }
    }
  }

  fecharAba(uniqueCode: string) {
    let abaParaFechar: IAbas | null = null;
    let indice = -1;

    // Localizar a aba que será fechada
    for (let i = 0; i < this.abas.length; i++) {
      if (this.abas[i].uniqueCode === uniqueCode) {
        abaParaFechar = this.abas[i];
        indice = i;
        break;
      }
    }

    if (!abaParaFechar) return;

    const component = abaParaFechar.conteudo.instance as IAbasComponent;

    // Verificar se a aba pode ser fechada sem confirmação
    if (!component.PodeFechar()) {
      // Fechar diretamente
      this.removerAba(abaParaFechar, indice);
      return;
    }

    // Exibir o modal para confirmação
    const subscription = this.modalService
      .mostrarModal(
        'Tem certeza que quer fechar a aba?<br>O conteúdo pesquisado será perdido.'
      )
      .subscribe({
        next: (res: string) => {
          if (res === 'yes') {
            this.removerAba(abaParaFechar!, indice);
          }
          subscription.unsubscribe();
        },
        error: (err) => console.log(err),
      });
  }

  removerAba(abaParaRemover: IAbas, indice: number) {
    if (abaParaRemover.conteudo.instance.EstaAtivo) {
      abaParaRemover.conteudo.instance.EstaAtivo = false;

      this.abas.splice(indice, 1);
      this.containerRef.detach();

      if (this.abas.length > 0) {
        if (indice === this.abas.length) {
          this.abas[indice - 1].conteudo.instance.EstaAtivo = true;
          this.containerRef.insert(this.abas[indice - 1].view);
          this.router.navigate([`/${this.abas[indice - 1].uniqueCode}`]);
        } else {
          this.abas[indice].conteudo.instance.EstaAtivo = true;
          this.containerRef.insert(this.abas[indice].view);
          this.router.navigate([`/${this.abas[indice].uniqueCode}`]);
        }
      } else {
        // Se não houver abas abertas, redireciona para a raiz
        this.router.navigate(['/']);
      }
    } else {
      this.abas.splice(indice, 1);
    }
  }
}
