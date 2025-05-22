import { TestBed } from '@angular/core/testing';

import { LichTiemService } from './lich-tiem.service';

describe('LichTiemService', () => {
  let service: LichTiemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LichTiemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
