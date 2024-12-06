import { Component, Input } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() Mensagem: string = '';
  Titulo: string = 'Confirmação';

  constructor(private modalService: ModalService){}

  fecharModal(retornarOpcao: string){
    this.modalService.modalContainer.clear();
    this.modalService.opcaoSelecionadaObservable.next(retornarOpcao);
  }
}
