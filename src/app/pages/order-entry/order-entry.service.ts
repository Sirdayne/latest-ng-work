import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface OrderConfirmI {
  clOrdID: number;
  id: number;
  symbol: string;
  repoPeriod: number;
  side: number;
  ordType: number;
  timeInForce: number;
  repoRate: number;
  autoRepoAmount: number;
  autoOrderQty: number;
  repurchaseDate: string;
  repurchaseAmount: number;
  repoPrice: number;
  investor: string;
  confirmReqID: number;
  offeredWaitingTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderEntryService {

  public static SIDES = [
    {
      value: '1',
      label: 'BUY(LEND)'
    },
    {
      value: '2',
      label: 'SELL(BORROW)'
    },
  ];

  public static TYPES = [
    {
      value: '1',
      label: 'MARKET'
    }, {
      value: '2',
      label: 'LIMIT'
    }
  ];

  public static TIMEINFORCES = [
    {
      value: '3',
      label: 'MARKET IOC (FAK)'
    }, {
      value: '4',
      label: 'MARKET FOK'
    }
  ];

  public static SUBTYPES = [
    {
      value: '0',
      label: 'DAY'
    },
    {
      value: '3',
      label: 'MARKET IOC (FAK)'
    }, {
      value: '4',
      label: 'MARKET FOK'
    }
  ];

  constructor(private httpService: HttpClient) { }

  createOrderEntry(body) {
    return this.httpService.post<OrderConfirmI>('/order/entry', body);
  }

  confirmOrder(confirmReqID) {
    return this.httpService.post(`/order/confirm`, { confirmType: '2', confirmReqID});
  }

  rejectOrder(confirmReqID) {
    return this.httpService.post(`/order/confirm`, { confirmType: '3', confirmReqID});
  }

  getSecuritites() {
    return this.httpService.get<string[]>('/securities');
  }

  getPeriodsBySecurity(security) {
    return this.httpService.get(`/periods_by_security/${security}`);
  }
}
