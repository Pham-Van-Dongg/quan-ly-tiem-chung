import { TestBed } from '@angular/core/testing';

import { CanBoService } from './can-bo.service';

describe('CanBoService', () => {
  let service: CanBoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanBoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
