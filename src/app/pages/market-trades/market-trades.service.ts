import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { MarketTradeI } from '../../models/market-trade.interface';
import {OrderI} from "../../models/order.interface";

@Injectable({
  providedIn: 'root'
})
export class MarketTradesService {

  constructor(private httpService: HttpClient) { }

  getMarketTrades(limit = 10, offset = 0,
                  value = '', column = '',
                  sortField = '', sortDirection = '')  {
    let params = new HttpParams();

    params = params.append('limit', String(limit));
    params = params.append('offset', String(offset));

    if (value && column) {
      params = params.append('value', String(value));
      params = params.append('column', String(column));
    }

    if (sortField && sortDirection) {
      params = params.append('orderings', String(sortField) + ' ' + String(sortDirection));
    }

    return this.httpService.get<MarketTradeI[]>('/market_trades', { params });
  }

  downloadExcel() {
    return this.httpService.get('/excel/market_trades', { responseType: 'blob' });
  }
}
