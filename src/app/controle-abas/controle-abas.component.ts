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
    private modalService: ModalService
  ) {
    this.itemAbasSubscription = abasService.itemAbaObservable.subscribe({
      next: (res: string) => {
        this.addNovaAba(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
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
      } else {
        aba.conteudo.instance.EstaAtivo = false;
      }
    }
  }

  fecharAba(uniqueCode: string) {
    var abaParaFechar: IAbas | null = null;
    var indice = -1;

    for (let i = 0; i < this.abas.length; i++)
      if (this.abas[i].uniqueCode === uniqueCode) {
        abaParaFechar = this.abas[i];
        indice = i;
      }

    var component = abaParaFechar?.conteudo.instance as IAbasComponent;

    if (component.PodeFechar()) {
      var subscription = this.modalService
        .mostrarModal(
          'Tem certeza que quer fechar a aba? O conteúdo pesquisado será perdido.'
        )
        .subscribe({
          next: (res: string) => {
            if (res === 'yes') {
              if (abaParaFechar !== null) {
                this.removerAba(abaParaFechar!, indice);
              }
            }

            subscription.unsubscribe();
          },
          error: (err) => console.log(err),
        });
    }
  }

  removerAba(abaParaRemover: IAbas, indice: number) {
    if (abaParaRemover.conteudo.instance.EstaAtivo) {
      // desativar esta aba
      abaParaRemover.conteudo.instance.EstaAtivo = false;

      // remover de abas e componentRef
      this.abas.splice(indice, 1);
      this.containerRef.detach();

      //fazer outras abas ativas, se presentes.
      if (this.abas.length > 0) {
        // Se isso for o último, então o próximo está ativo, se não faça o anterior ativo.
        if (indice === this.abas.length) {
          this.abas[indice - 1].conteudo.instance.EstaAtivo = true;
          this.containerRef.insert(this.abas[indice - 1].view);
        } else {
          this.abas[indice].conteudo.instance.EstaAtivo = true;
          this.containerRef.insert(this.abas[indice].view);
        }
      }
    } else {
      //Remover de abas
      this.abas.splice(indice, 1);
    }
  }
}
