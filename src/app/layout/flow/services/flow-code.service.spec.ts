import { TestBed } from '@angular/core/testing';

import { FlowCodeService } from './flow-code.service';

describe('FlowCodeService', () => {
  let service: FlowCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
