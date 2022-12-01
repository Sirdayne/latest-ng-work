import { Injectable } from '@angular/core';
import { OrderI } from '../../models/order.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ResponseTableI} from "../../models/response-table.interface";

@Injectable({
  providedIn: 'root'
})
export class MyOrdersService {

  constructor(private httpService: HttpClient) { }

  getMyOrders(limit = 10, offset = 0,
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
      params = params.append('orderings', String(this.setIntColumn(sortField)) + ' ' + String(sortDirection));
    }

    return this.httpService.get<OrderI[]>('/orders', { params });
  }

  downloadExcel() {
    return this.httpService.get('/excel/orders', { responseType: 'blob' });
  }

  cancelOrder(clientOrderId) {
    return this.httpService.post(`/order/cancel/${clientOrderId}`, {});
  }

  setIntColumn(sortField) {
    return this.isIntColumn(sortField) ? `${sortField}::int` : sortField;
  }

  /* array of columns that need to be modified for SQL query by adding ::int */
  INT_ARRAY = ['order_id'];

  isIntColumn(sortField) {
    const found = this.INT_ARRAY.find(item => item === sortField);
    return !!found;
  }
}
