import { TestBed } from '@angular/core/testing';

import { PrivacypolicyService } from './privacypolicy.service';

describe('PrivacypolicyService', () => {
  let service: PrivacypolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivacypolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
