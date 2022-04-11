import { Injectable } from '@angular/core';
import { OrderI } from '../../models/order.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyOrdersService {

  constructor(private httpService: HttpClient) { }

  getMyOrders() {
    return this.httpService.get<OrderI[]>('/orders');
  }

  cancelOrder(clientOrderId) {
    return this.httpService.post(`/order/cancel/${clientOrderId}`, {});
  }
}
