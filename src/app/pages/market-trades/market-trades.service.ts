import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarketTradeI } from '../../models/market-trade.interface';

@Injectable({
  providedIn: 'root'
})
export class MarketTradesService {

  marketTrades: MarketTradeI[] = [
    {
      time: '2022-02-18T14:18:41.425088Z',
      status: 'MATCHED',
      security: 'KAP.Y',
      duration: 1,
      repoPrice: 17.40,
      repoRate: 3.5500,
      quantity: 100,
      amount: 1740,
      repurchaseDate: '2022-02-21T00:00:00Z',
      repurchaseValue: 1740.17,
      deltaRepoIncome: 0.17
    },
    {
      time: '2022-02-18T14:18:29.425088Z',
      status: 'MATCHED',
      security: 'KAP.Y',
      duration: 1,
      repoPrice: 17.40,
      repoRate: 4.0100,
      quantity: 807,
      amount: 14041.80,
      repurchaseDate: '2022-02-21T00:00:00Z',
      repurchaseValue: 14043.34,
      deltaRepoIncome: 1.54
    },
    {
      time: '2022-02-18T12:55:44.425088Z',
      status: 'MATCHED',
      security: 'KAP.Y',
      duration: 7,
      repoPrice: 22.50,
      repoRate: 5.2121,
      quantity: 784,
      amount: 17640.00,
      repurchaseDate: '2022-02-25T00:00:00Z',
      repurchaseValue: 17657.63,
      deltaRepoIncome: 17.63
    },
    {
      time: '2022-02-18T12:51:48.425088Z',
      status: 'MATCHED',
      security: 'KAP.Y',
      duration: 14,
      repoPrice: 22.25,
      repoRate: 6.0000,
      quantity: 787,
      amount: 17510.75,
      repurchaseDate: '2022-03-04T00:00:00Z',
      repurchaseValue: 17551.05,
      deltaRepoIncome: 40.30
    },
    {
      time: '2022-02-18T12:49:22.425088Z',
      status: 'MATCHED',
      security: 'KCELL',
      duration: 1,
      repoPrice: 22.50,
      repoRate: 4.0000,
      quantity: 650,
      amount: 14625.00,
      repurchaseDate: '2022-02-21:00:00Z',
      repurchaseValue: 14626.60,
      deltaRepoIncome: 1.60
    },
    {
      time: '2022-02-18T12:48:59.425088Z',
      status: 'MATCHED',
      security: 'KCELL',
      duration: 7,
      repoPrice: 22.00,
      repoRate: 5.5555,
      quantity: 400,
      amount: 8800.00,
      repurchaseDate: '2022-02-25:00:00Z',
      repurchaseValue: 8809.38,
      deltaRepoIncome: 9.38
    },
    {
      time: '2022-02-18T12:04:38.425088Z',
      status: 'MATCHED',
      security: 'KCELL',
      duration: 7,
      repoPrice: 22.00,
      repoRate: 5.7700,
      quantity: 181,
      amount: 3982.00,
      repurchaseDate: '2022-02-25:00:00Z',
      repurchaseValue: 3986.41,
      deltaRepoIncome: 4.41
    }
  ];

  constructor(private httpService: HttpClient) { }

  getMockMarketTrades() {
    return this.marketTrades;
  }

  getMarketTrades() {
    return this.httpService.get<MarketTradeI[]>('/market_trades');
  }
}
