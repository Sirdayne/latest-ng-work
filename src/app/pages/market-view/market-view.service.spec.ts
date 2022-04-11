import { TestBed } from '@angular/core/testing';

import { MarketViewService } from './market-view.service';

describe('MarketViewService', () => {
  let service: MarketViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
