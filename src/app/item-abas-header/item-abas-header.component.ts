import {
  Component,
  HostBinding,
  HostListener,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'item-abas-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-abas-header.component.html',
  styleUrl: './item-abas-header.component.css',
})
export class ItemAbasHeaderComponent implements OnChanges {
  @Input() Header: string = '';
  @Input() UniqueCode: string = '';
  @Input() EstaAtivo: boolean = true;

  @Output() Fechar: EventEmitter<string> = new EventEmitter();

  @HostBinding('class') hostClass: string = '';
  @HostListener('click') onHostSelecionado() {
    this.Selecionado.emit(this.UniqueCode);
  }
  @Output() Selecionado: EventEmitter<string> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['EstaAtivo'] !== undefined) {
      if (changes['EstaAtivo'].currentValue === true) {
        this.hostClass = 'active';
      } else {
        this.hostClass = '';
      }
    }
  }

  fecharAba() {
    this.Fechar.emit(this.UniqueCode);
  }
}
