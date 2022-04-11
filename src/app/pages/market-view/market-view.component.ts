import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { MarketViewService } from './market-view.service';
import {SocketService} from '../home/socket.service';
import {finalize} from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { ImportService } from '../../shared/import.service';
import { FormatDataService } from '../../shared/format-data.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-market-view',
  templateUrl: './market-view.component.html',
  styleUrls: ['./market-view.component.css']
})
export class MarketViewComponent implements OnInit, OnDestroy {
  @Input() downloadCSVSubject: Subject<any>;
  @Input() isSearchShown;
  isHighlighted = false;

  initData;
  dataSource;
  state = 'market-view';
  security;
  period;
  loading = false;

  @ViewChild(MatSort) sort: MatSort;

  subscription = new Subscription();

  tableColumns = [
    {
      value: 'security',
      label: 'Security',
    },
    {
      value: 'period',
      label: 'Period',
    },
    {
      value: 'currency',
      label: 'Currency',
    },
    {
      value: 'state',
      label: 'State',
    },
    {
      value: 'assetClass',
      label: 'Asset Class',
    },
    {
      value: 'refPrice',
      label: 'Ref Price',
    },
    {
      value: 'haircut',
      label: 'Haircut',
    },
    {
      value: 'repoPrice',
      label: 'Repo Price',
    },
    {
      value: 'buyerQty',
      label: 'Quantity To Lend',
    },
    {
      value: 'buyerAmount',
      label: 'Amount To Lend',
    },
    {
      value: 'buyerRate',
      label: 'Lender Repo Rate',
    },
    {
      value: 'sellerRate',
      label: 'Borrower Repo Rate',
    },
    {
      value: 'sellerAmount',
      label: 'Amount To Borrow',
    },
    {
      value: 'sellerQty',
      label: 'Quantity To Borrow',
    },
    {
      value: 'openRepoRate',
      label: 'Open Repo Rate',
    },
    {
      value: 'highRepoRate',
      label: 'High Repo Rate',
    },
    {
      value: 'lowRepoRate',
      label: 'Low Repo Rate',
    },
    {
      value: 'lastRepoRate',
      label: 'Last Repo Rate',
    },{
      value: 'previousCloseRepoRate',
      label: 'Previous Close Repo Rate',
    },
    {
      value: 'repoRateChange',
      label: 'Repo Rate Change',
    },
    {
      value: 'dailyVolume',
      label: 'Daily Volume',
    },
    {
      value: 'dailyValue',
      label: 'Daily Value',
    },
    {
      value: 'numberOfTrades',
      label: 'Number Of Trades',
    }
  ];

  constructor(private marketViewService: MarketViewService,
              private socketService: SocketService,
              private importService: ImportService,
              private formatDataService: FormatDataService) { }

  ngOnInit(): void {
    this.getMarketView();
    this.subscription.add(this.socketService.messageSubject.subscribe(msg => {
      if (msg === 'market_view') {
        this.getMarketView()
      }
    }));
    // this.simulateHighlightNewRecord();

    this.onDownloadCSVSubject();
  }

  onDownloadCSVSubject() {
    this.subscription.add(this.downloadCSVSubject.subscribe((view) => {
      if (view === 'market-view') {
        this.importService.json2csv(view, this.dataSource._renderData._value, this.tableColumns);
      }
    }));
  }

  getMarketView() {
    this.loading = true;
    this.marketViewService.getMarketView().pipe(
      finalize(() => this.loading = false)
    ).subscribe(marketView => {
      this.initData = this.formatData(marketView);
      this.dataSource = new MatTableDataSource(this.initData);
      this.dataSource.sort = this.sort;
    });
  }

  formatData(data) {
    data = data.map(item => {
      item.refPrice = this.formatDataService.toDecimalFour(item.refPrice);
      item.haircut = this.formatDataService.toDecimalFour(item.haircut);
      item.repoPrice = this.formatDataService.toDecimalFour(item.repoPrice);
      item.buyerAmount = this.formatDataService.toDecimalTwo(item.buyerAmount);
      item.buyerRate = this.formatDataService.toDecimalFour(item.buyerRate);
      item.sellerRate = this.formatDataService.toDecimalFour(item.sellerRate);
      item.sellerAmount = this.formatDataService.toDecimalTwo(item.sellerAmount);
      item.openRepoRate = this.formatDataService.toDecimalFour(item.openRepoRate);
      item.highRepoRate = this.formatDataService.toDecimalFour(item.highRepoRate);
      item.lowRepoRate = this.formatDataService.toDecimalFour(item.lowRepoRate);
      item.lastRepoRate = this.formatDataService.toDecimalFour(item.lastRepoRate);
      item.previousCloseRepoRate = this.formatDataService.toDecimalFour(item.previousCloseRepoRate);
      item.repoRateChange = this.formatDataService.toDecimalFour(item.repoRateChange);
      item.dailyValue = this.formatDataService.toDecimalTwo(item.dailyValue);
      return item;
    });
    return data;
  }

  simulateHighlightNewRecord() {
    // setTimeout(() => {
    //   this.isHighlighted = true;
    //   this.dataSource[0].refPrice = 100;
    // }, 3000);
  }

  unHighlight() {
    this.isHighlighted = false
  }

  selectOrderDepth(row) {
    this.security = row.security;
    this.period = row.period;
    this.setState('order-depth');
  }

  setState(state) {
    this.state = state;
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
    const arr = this.tableColumns.map(col => col.value);
    arr.push('actions');
    return arr;
  }
}
