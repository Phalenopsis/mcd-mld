import { TestBed } from '@angular/core/testing';

import { CalcTablePositionService } from './calc-table-position.service';

describe('CalcTablePositionService', () => {
  let service: CalcTablePositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalcTablePositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
