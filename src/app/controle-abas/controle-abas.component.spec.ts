import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleAbasComponent } from './controle-abas.component';

describe('ControleAbasComponent', () => {
  let component: ControleAbasComponent;
  let fixture: ComponentFixture<ControleAbasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControleAbasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControleAbasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
