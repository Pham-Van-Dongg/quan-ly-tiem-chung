import { TestBed } from '@angular/core/testing';

import { NguoidanService } from './nguoidan.service';

describe('NguoidanService', () => {
  let service: NguoidanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NguoidanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
