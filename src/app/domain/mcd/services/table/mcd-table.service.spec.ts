import { TestBed } from '@angular/core/testing';

import { McdTableService } from './mcd-table.service';

describe('TableService', () => {
  let service: McdTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(McdTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
