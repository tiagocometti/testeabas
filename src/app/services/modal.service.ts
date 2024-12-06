import { Injectable, ViewContainerRef } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modalContainer!: ViewContainerRef;

  opcaoSelecionadaObservable = new Subject<string>();
  constructor() {}

  mostrarModal(mensagem: string) {
    this.modalContainer.clear();
    var component = this.modalContainer.createComponent(ModalComponent);
    component.instance.Mensagem = mensagem;
    return this.opcaoSelecionadaObservable;
  }
}
