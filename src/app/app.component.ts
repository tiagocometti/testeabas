import { AbasService } from './services/abas.service';
import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ControleAbasComponent } from './controle-abas/controle-abas.component';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './services/modal.service';
import { BotaoAbasExcedentesComponent } from './botao-abas-excedentes/botao-abas-excedentes.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ControleAbasComponent,
    ModalComponent,
    BotaoAbasExcedentesComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'TesteAbas';

  @ViewChild('modal', { read: ViewContainerRef, static: true })
  conteinerRef!: ViewContainerRef;

  @ViewChild('controleAbas', { static: false })
  controleAbas!: ControleAbasComponent;

  abasVisiveisTexto: string = '';
  abasExcedentesTexto: string = '';
  mostrarBotaoAbasExcedentes: boolean = false;

  constructor(
    private abasService: AbasService,
    private modalService: ModalService
  ) {}

  ngAfterViewInit(): void {
    this.modalService.modalContainer = this.conteinerRef;
  }

  inserirComponent(code: string) {
    this.abasService.itemAbaObservable.next(code);
  }

  atualizarAbasVisiveis(texto: string) {
    this.abasVisiveisTexto = texto;
  }

  atualizarAbasExcedentes(texto: string) {
    this.abasExcedentesTexto = texto;
    this.mostrarBotaoAbasExcedentes = texto.length > 0;
  }

  moverAbaParaVisivel(uniqueCode: string) {
    if (this.controleAbas) {
      this.controleAbas.moverAbaParaVisivel(uniqueCode);
    } else {
      console.warn('ControleAbasComponent não está disponível.');
    }
  }
}
