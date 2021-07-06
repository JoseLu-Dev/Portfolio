import { TestBed } from '@angular/core/testing';

import { ComponentInScreenService } from './component-in-screen.service';

describe('ComponentInScreenService', () => {
  let service: ComponentInScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentInScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
