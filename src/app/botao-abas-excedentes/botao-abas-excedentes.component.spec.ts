import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoAbasExcedentesComponent } from './botao-abas-excedentes.component';

describe('BotaoAbasExcedentesComponent', () => {
  let component: BotaoAbasExcedentesComponent;
  let fixture: ComponentFixture<BotaoAbasExcedentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoAbasExcedentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotaoAbasExcedentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
