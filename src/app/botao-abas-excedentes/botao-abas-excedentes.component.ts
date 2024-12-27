import { Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'botao-abas-excedentes',
  standalone: true,
  templateUrl: './botao-abas-excedentes.component.html',
  styleUrl: './botao-abas-excedentes.component.css',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class BotaoAbasExcedentesComponent {
  mostrarLista: boolean = false;
  @Input() visible: boolean = false;

  toggleLista() {
    this.mostrarLista = !this.mostrarLista;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.btn-abas-excedentes') && !target.closest('.lista-abas-excedentes')) {
      this.mostrarLista = false;
    }
  }
}