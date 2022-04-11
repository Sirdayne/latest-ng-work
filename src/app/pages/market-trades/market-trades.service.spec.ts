import { TestBed } from '@angular/core/testing';

import { MarketTradesService } from './market-trades.service';

describe('MarketTradesService', () => {
  let service: MarketTradesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketTradesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
