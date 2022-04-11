import { Injectable } from '@angular/core';
import { TradeI } from '../../models/trade.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyTradesService {

  constructor(private httpService: HttpClient) { }

  getMyTrades() {
    return this.httpService.get<TradeI[]>('/trades');
  }
}
