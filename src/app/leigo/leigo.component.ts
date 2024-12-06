import { Component, Input } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IAbasComponent } from '../interfaces/interfaces';

@Component({
  selector: 'leigo',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './leigo.component.html',
  styleUrl: './leigo.component.css'
})
export class LeigoComponent implements IAbasComponent {
  inputControl: FormControl;
  @Input() EstaAtivo: boolean = true;

  constructor(fb: FormBuilder) {
    this.inputControl = fb.control('');
  }

  PodeFechar(): boolean {
    return false;
  }
  
}
