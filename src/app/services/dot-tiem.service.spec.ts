import { TestBed } from '@angular/core/testing';

import { DotTiemService } from './dot-tiem.service';

describe('DotTiemService', () => {
  let service: DotTiemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DotTiemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
