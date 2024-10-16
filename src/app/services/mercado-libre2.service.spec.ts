import { TestBed } from '@angular/core/testing';

import { MercadoLibre2Service } from './mercado-libre2.service';

describe('MercadoLibre2Service', () => {
  let service: MercadoLibre2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MercadoLibre2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
