import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MarketViewService } from '../market-view/market-view.service';
import {finalize} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SocketService } from '../home/socket.service';
import { FormatDataService } from '../../shared/format-data.service';

@Component({
  selector: 'app-order-depth',
  templateUrl: './order-depth.component.html',
  styleUrls: ['./order-depth.component.css']
})
export class OrderDepthComponent implements OnInit, OnDestroy {
  @Input() security;
  @Input() period;
  @Output() setState = new EventEmitter();
  dataSource;
  loading;
  subscription = new Subscription();

  displayedColumns: string[] = [
    'buyerQty', 'buyerAmount', 'buyerRate', 'sellerRate', 'sellerAmount', 'sellerQty',
  ];

  constructor(private marketViewService: MarketViewService,
              private socketService: SocketService,
              private formatDataService: FormatDataService) { }

  ngOnInit(): void {
    this.getOrderDepth();
    this.subscription.add(this.socketService.messageSubject.subscribe(msg => {
      if (msg === 'market_view') {
        this.getOrderDepth()
      }
    }));
  }

  getOrderDepth() {
    this.loading = true;
    this.marketViewService.getOrderDepth(this.security, this.period).pipe(
      finalize(() => this.loading = false)
    ).subscribe(orderDepth => {
      this.dataSource = this.formatData(orderDepth);
    }, err => this.dataSource = []);
  }

  formatData(data) {
    data = data.map(item => {
      item.buyerAmount = this.formatDataService.toDecimalTwo(item.buyerAmount);
      item.buyerRate = this.formatDataService.toDecimalFour(item.buyerRate);
      item.sellerRate = this.formatDataService.toDecimalFour(item.sellerRate);
      item.sellerAmount = this.formatDataService.toDecimalTwo(item.sellerAmount);
      return item;
    });
    return data;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
