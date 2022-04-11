import { Injectable } from '@angular/core';
import { MarketViewI } from '../../models/market-view.interface';
import { HttpClient } from '@angular/common/http';
import {OrderDepthI} from '../../models/order-depth.interface';

@Injectable({
  providedIn: 'root'
})
export class MarketViewService {

  constructor(private httpService: HttpClient) { }

  getMarketView() {
    return this.httpService.get<MarketViewI[]>('/market_view');
  }

  getOrderDepth(security, period) {
    return this.httpService.get<OrderDepthI[]>('/order_depth', {
      params: {
        security,
        period
      }
    });
  }
}
