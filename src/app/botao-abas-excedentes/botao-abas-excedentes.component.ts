import { Component, HostListener, Input, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'botao-abas-excedentes',
  standalone: true,
  templateUrl: './botao-abas-excedentes.component.html',
  styleUrl: './botao-abas-excedentes.component.css',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
})
export class BotaoAbasExcedentesComponent implements OnChanges {
  mostrarLista: boolean = false;

  @Input() visible: boolean = false; // Controla a visibilidade do botão
  @Input() abasExcedentes: string[] = []; // Lista de abas excedentes recebida

  // Detecta mudanças nos inputs
  ngOnChanges(changes: SimpleChanges): void {
    // Fecha a lista automaticamente se o botão desaparecer
    if (changes['visible'] && !this.visible) {
      this.mostrarLista = false;
    }

    // Fecha a lista se a lista de abas excedentes ficar vazia
    if (changes['abasExcedentes'] && this.abasExcedentes.length === 0) {
      this.mostrarLista = false;
    }
  }

  // Alterna a visibilidade da lista
  toggleLista() {
    this.mostrarLista = !this.mostrarLista;
  }

  // Fecha a lista ao clicar fora dela
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.btn-abas-excedentes') && !target.closest('.lista-abas-excedentes')) {
      this.mostrarLista = false;
    }
  }
}
