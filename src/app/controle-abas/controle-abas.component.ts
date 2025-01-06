import {
  Component,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  Type,
  EventEmitter,
  Output,
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
  excedentes: IAbas[] = [];
  @ViewChild('containerRef', { read: ViewContainerRef, static: true })
  containerRef!: ViewContainerRef;
  @Output() abasVisiveisMudaram = new EventEmitter<string>();
  @Output() abasExcedentesMudaram = new EventEmitter<string>();

  constructor(
    private abasService: AbasService,
    private modalService: ModalService,
    private router: Router // Adicionado para navegação dinâmica
  ) {
    this.itemAbasSubscription = abasService.itemAbaObservable.subscribe({
      next: (res: string) => {
        this.addNovaAba(res);
        this.detectarAbasExcedentes(); // Atualiza a detecção ao adicionar novas abas
      },
      error: (err) => {
        console.log(err);
      },
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.detectarAbasExcedentes.bind(this)); // Monitora redimensionamento
    }

    // Verifica se não há abas ativas ao carregar
    if (this.abas.length === 0) {
      this.router.navigate(['/']); // Redireciona para a raiz
    }
  }

  ngOnDestroy(): void {
    this.itemAbasSubscription.unsubscribe();

    if (typeof window !== 'undefined') {
      window.removeEventListener(
        'resize',
        this.detectarAbasExcedentes.bind(this)
      );
    }
  }

  addNovaAba(code: string) {
    const uniqueCode = `${code}-${this.indice}`;
    this.indice++;

    this.containerRef.detach();
    const component = this.containerRef.createComponent(
      this.getTipoComponent(code)
    );
    component.instance.EstaAtivo = true;

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
    switch (code) {
      case 'empresa':
        return EmpresaComponent;
      case 'leigo':
        return LeigoComponent;
      default:
        return ProfissionalComponent;
    }
  }

  private debounceTimeout: any = null; // Variável para armazenar o timeout do debounce

  detectarAbasExcedentes() {
    setTimeout(() => {
      const container = document.querySelector('.item-abas') as HTMLElement;

      if (!container) {
        console.warn('Container .item-abas não encontrado.');
        return;
      }

      const abasHTML = Array.from(
        container.querySelectorAll('[data-unique-code]')
      ) as HTMLElement[];

      if (abasHTML.length === 0) {
        this.excedentes = [];
        this.abasVisiveisMudaram.emit('');
        this.abasExcedentesMudaram.emit('');
        console.log('Nenhuma aba encontrada.');
        return;
      }

      let linhaInicial: number | null = null;

      this.excedentes = [];
      const abasVisiveis: IAbas[] = [];

      for (const abaHTML of abasHTML) {
        const linhaAtual = abaHTML.getBoundingClientRect().top;
        const uniqueCode = abaHTML.getAttribute('data-unique-code');

        if (!uniqueCode) continue;

        const aba = this.abas.find((a) => a.uniqueCode === uniqueCode);

        if (!aba) continue;

        // Define a linha inicial com a posição da primeira aba encontrada
        if (linhaInicial === null) {
          linhaInicial = linhaAtual;
        }

        // Se a aba estiver na mesma linha inicial, é visível; caso contrário, é excedente
        if (linhaAtual > linhaInicial) {
          this.excedentes.push(aba);
        } else {
          abasVisiveis.push(aba);
        }
      }

      // Atualiza os textos com base nos uniqueCodes das abas
      const abasVisiveisTexto = abasVisiveis
        .map((aba) => aba.uniqueCode)
        .join(', ');
      const abasExcedentesTexto = this.excedentes
        .map((aba) => aba.uniqueCode)
        .join(', ');

      // Atualiza as propriedades para exibição na interface
      this.abasVisiveisMudaram.emit(abasVisiveisTexto);
      this.abasExcedentesMudaram.emit(abasExcedentesTexto);
    }, 50); // Tempo ajustado para garantir sincronização
  }

  selecionarAba(uniqueCode: string) {
    for (let aba of this.abas) {
      if (aba.uniqueCode === uniqueCode) {
        aba.conteudo.instance.EstaAtivo = true;
        this.containerRef.detach();
        this.containerRef.insert(aba.view);

        const functionality = aba.conteudo.instance.lastFunctionality || '';
        this.router.navigate([`/${uniqueCode}`, functionality]); // Exemplo: /profissional-0/joao
      } else {
        aba.conteudo.instance.EstaAtivo = false;
      }
    }
  }

  fecharAba(uniqueCode: string) {
    const indice = this.abas.findIndex((aba) => aba.uniqueCode === uniqueCode);
    if (indice === -1) return;

    const abaParaFechar = this.abas[indice];

    // Verifica se a aba pode ser fechada sem confirmação
    if (!abaParaFechar.conteudo.instance.PodeFechar()) {
      this.removerAba(indice);
      return;
    }

    // Exibir o modal para confirmação
    const subscription = this.modalService
      .mostrarModal(
        'Tem certeza que quer fechar a aba? O conteúdo será perdido.'
      )
      .subscribe({
        next: (res) => {
          if (res === 'yes') {
            this.removerAba(indice);
          }
          subscription.unsubscribe();
        },
        error: (err) => console.log(err),
      });

    // Atualiza as listas de abas após a remoção
    setTimeout(() => {
      this.detectarAbasExcedentes();
    }, 0);
  }

  removerAba(indice: number) {
    const abaParaRemover = this.abas[indice];

    if (!abaParaRemover) {
      console.warn('Aba para remover não encontrada.');
      return;
    }

    // Verifica se a aba está ativa e precisa ser removida do DOM
    if (abaParaRemover.conteudo.instance.EstaAtivo) {
      abaParaRemover.conteudo.instance.EstaAtivo = false;
      this.containerRef.detach();

      // Ativa a aba anterior ou próxima, se existir
      if (this.abas.length > 1) {
        const novaAbaAtiva = this.abas[indice === 0 ? 1 : indice - 1];
        novaAbaAtiva.conteudo.instance.EstaAtivo = true;
        this.containerRef.insert(novaAbaAtiva.view);
        this.router.navigate([`/${novaAbaAtiva.uniqueCode}`]);
      } else {
        this.router.navigate(['/']);
      }
    }

    // Remove a aba da lista
    this.abas.splice(indice, 1);

    // Aguarda o DOM se estabilizar e atualiza a detecção
    setTimeout(() => {
      this.detectarAbasExcedentes();
    }, 0);
  }

  moverAbaParaVisivel(uniqueCode: string) {
    // Localiza a aba na lista de abas (incluindo visíveis e excedentes)
    const indice = this.abas.findIndex((aba) => aba.uniqueCode === uniqueCode);
    if (indice === -1) {
      console.warn('Aba não encontrada:', uniqueCode);
      return;
    }

    // Remove a aba da posição atual
    const abaSelecionada = this.abas.splice(indice, 1)[0];

    // Move a aba para a primeira posição
    this.abas.forEach((aba) => (aba.conteudo.instance.EstaAtivo = false)); // Desativa todas as abas
    abaSelecionada.conteudo.instance.EstaAtivo = true; // Ativa a aba selecionada
    this.abas.unshift(abaSelecionada);

    // Atualiza o container para exibir o conteúdo da aba selecionada
    this.containerRef.detach();
    this.containerRef.insert(abaSelecionada.view);

    // Atualiza a URL para refletir a aba selecionada
    this.router.navigate([`/${uniqueCode}`]);

    // Atualiza as listas de abas visíveis e excedentes
    setTimeout(() => {
      this.detectarAbasExcedentes();
    }, 0);
  }
}
