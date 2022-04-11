import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDepthComponent } from './order-depth.component';

describe('OrderDepthComponent', () => {
  let component: OrderDepthComponent;
  let fixture: ComponentFixture<OrderDepthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDepthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDepthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
