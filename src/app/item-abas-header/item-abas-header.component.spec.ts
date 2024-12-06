import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAbasHeaderComponent } from './item-abas-header.component';

describe('ItemAbasHeaderComponent', () => {
  let component: ItemAbasHeaderComponent;
  let fixture: ComponentFixture<ItemAbasHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemAbasHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemAbasHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
