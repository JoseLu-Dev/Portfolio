import { TestBed } from '@angular/core/testing';

import { GithubApiCacheService } from './github-api-cache.service';

describe('ApiCacheService', () => {
  let service: GithubApiCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithubApiCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
