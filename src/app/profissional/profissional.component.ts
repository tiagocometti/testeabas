import { Component, Input } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IAbasComponent } from '../interfaces/interfaces';
import { AbasService } from '../services/abas.service';

@Component({
  selector: 'profissional',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profissional.component.html',
  styleUrl: './profissional.component.css'
})
export class ProfissionalComponent implements IAbasComponent {
  inputControl: FormControl;
  @Input() EstaAtivo: boolean = true;

  constructor(fb: FormBuilder, private abasService: AbasService) {
    this.inputControl = fb.control('');
  }  

  PodeFechar(): boolean {
    if (this.inputControl.value !== '' ) return true;
    else return false;
  }

  abrirEmpresa(){
    this.abasService.addNovaAba('empresa');
  }

}
