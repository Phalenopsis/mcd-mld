import { TestBed } from '@angular/core/testing';

import { DrawingCommandService } from './drawing-command.service';

describe('DrawingService', () => {
  let service: DrawingCommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawingCommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
