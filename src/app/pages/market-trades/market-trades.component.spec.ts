import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketTradesComponent } from './market-trades.component';

describe('MarketTradesComponent', () => {
  let component: MarketTradesComponent;
  let fixture: ComponentFixture<MarketTradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketTradesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
