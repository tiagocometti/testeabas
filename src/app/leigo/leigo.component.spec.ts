import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeigoComponent } from './leigo.component';

describe('LeigoComponent', () => {
  let component: LeigoComponent;
  let fixture: ComponentFixture<LeigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeigoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
