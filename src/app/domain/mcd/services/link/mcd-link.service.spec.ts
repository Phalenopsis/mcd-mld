import { TestBed } from '@angular/core/testing';

import { McdLinkService } from './mcd-link.service';

describe('McdLinkService', () => {
  let service: McdLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(McdLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
