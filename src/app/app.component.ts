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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ControleAbasComponent, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  title = 'TesteAbas';
  @ViewChild('modal', { read: ViewContainerRef, static: true })
  conteinerRef!: ViewContainerRef;

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
}
