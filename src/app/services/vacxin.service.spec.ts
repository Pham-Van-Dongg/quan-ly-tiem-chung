import { TestBed } from '@angular/core/testing';

import { VacxinService } from './vacxin.service';

describe('VacxinService', () => {
  let service: VacxinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacxinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
