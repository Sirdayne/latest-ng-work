import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketViewSearchComponent } from './market-view-search.component';

describe('MarketViewSearchComponent', () => {
  let component: MarketViewSearchComponent;
  let fixture: ComponentFixture<MarketViewSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketViewSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketViewSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
