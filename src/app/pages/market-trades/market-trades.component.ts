import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { SocketService } from '../home/socket.service';
import { MarketTradesService } from './market-trades.service';
import { ImportService } from '../../shared/import.service';
import { FormatDataService } from '../../shared/format-data.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-market-trades',
  templateUrl: './market-trades.component.html',
  styleUrls: ['./market-trades.component.css']
})
export class MarketTradesComponent implements OnInit, OnDestroy {
  @Input() downloadCSVSubject: Subject<any>;
  @Input() isSearchShown;

  tableColumns = [
    {
      value: 'transactTime',
      label: 'Time',
    },
    {
      value: 'status',
      label: 'Status',
    },
    {
      value: 'security',
      label: 'Security',
    },
    {
      value: 'period',
      label: 'Duration',
    },
    {
      value: 'price',
      label: 'Repo Price',
    },
    {
      value: 'rate',
      label: 'Repo Rate',
    },
    {
      value: 'quantity',
      label: 'Quantity',
    },
    {
      value: 'amount',
      label: 'Amount',
    },
    {
      value: 'repurchaseDate',
      label: 'Repurchase Date',
    },
    {
      value: 'repurchaseAmount',
      label: 'Repurchase Value',
    },
    {
      value: 'deltaRepoIncome',
      label: 'Delta (Repo Income)',
    }
  ];

  initData;
  dataSource;

  @ViewChild(MatSort) sort: MatSort;

  subscription = new Subscription();

  constructor(private marketTradesService: MarketTradesService,
              private socketService: SocketService,
              private importService: ImportService,
              private formatDataService: FormatDataService) { }

  ngOnInit(): void {
    this.getMarketTrades();
    this.subscription.add(this.socketService.messageSubject.subscribe(msg => {
      if (msg === 'market_trades') {
        this.getMarketTrades();
      }
    }));

    this.onDownloadCSVSubject();
  }

  onDownloadCSVSubject() {
    this.subscription.add(this.downloadCSVSubject.subscribe((view) => {
      if (view === 'market-trades') {
        this.importService.json2csv(view, this.dataSource._renderData._value, this.tableColumns);
      }
    }));
  }

  getMarketTrades() {
    this.marketTradesService.getMarketTrades().subscribe(marketTrades => {
      this.initData = this.formatData(marketTrades);
      this.dataSource = new MatTableDataSource(this.initData);
      this.dataSource.sort = this.sort;
    });
  }

  formatData(data) {
    data = data.map(item => {
      item.transactTime = this.formatDataService.toDateTime(item.transactTime);
      item.price = this.formatDataService.toDecimalTwo(item.price);
      item.rate = this.formatDataService.toDecimalFour(item.rate);
      item.amount = this.formatDataService.toDecimalTwo(item.amount);
      item.repurchaseDate = this.formatDataService.toDate(item.repurchaseDate);
      item.repurchaseAmount = this.formatDataService.toDecimalTwo(item.repurchaseAmount);
      item.deltaRepoIncome = this.formatDataService.toDecimalTwo(item.deltaRepoIncome);
      return item;
    });
    return data;
  }

  setFilteredData(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get displayedColumns() {
    return this.tableColumns.map(col => col.value);
  }
}
