import { TestBed } from '@angular/core/testing';

import { PaidServicesService } from './paid-services.service';

describe('PaidServicesService', () => {
  let service: PaidServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaidServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
