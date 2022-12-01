import { Injectable } from '@angular/core';
import { TradeI } from '../../models/trade.interface';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyTradesService {

  constructor(private httpService: HttpClient) { }

  getMyTrades(limit = 10, offset = 0,
              value = '', column = '',
              sortField = '', sortDirection = '') {
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

    return this.httpService.get<TradeI[]>('/trades', { params });
  }

  downloadExcel() {
    return this.httpService.get('/excel/trades', { responseType: 'blob' });
  }
}
