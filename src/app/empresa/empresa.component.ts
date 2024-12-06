import { Component, Input } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IAbasComponent } from '../interfaces/interfaces';

@Component({
  selector: 'empresa',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css',
})
export class EmpresaComponent implements IAbasComponent {
  inputControl: FormControl;
  @Input() EstaAtivo: boolean = true;

  constructor(fb: FormBuilder) {
    this.inputControl = fb.control('');
  }

  PodeFechar(): boolean {
    return false;
  }
}
