import { TestBed } from '@angular/core/testing';

import { AbasService } from './abas.service';

describe('AbasService', () => {
  let service: AbasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
