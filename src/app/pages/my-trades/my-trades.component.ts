import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MyTradesService } from './my-trades.service';
import { SocketService } from '../home/socket.service';
import { Subject, Subscription } from 'rxjs';
import { ImportService } from '../../shared/import.service';
import { FormatDataService } from '../../shared/format-data.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-my-trades',
  templateUrl: './my-trades.component.html',
  styleUrls: ['./my-trades.component.css']
})
export class MyTradesComponent implements OnInit, OnDestroy {
  @Input() downloadCSVSubject: Subject<any>;
  @Input() isSearchShown;

  tableColumns = [
    {
      value: 'transactTime',
      label: 'Time'
    },
    {
      value: 'side',
      label: 'Side'
    },
    {
      value: 'tradeId',
      label: 'Trade Id'
    },
    {
      value: 'status',
      label: 'Status'
    },
    {
      value: 'security',
      label: 'Security'
    },
    {
      value: 'currency',
      label: 'Currency'
    },
    {
      value: 'period',
      label: 'Period'
    },
    {
      value: 'repoRate',
      label: 'Rate'
    },
    {
      value: 'quantity',
      label: 'Quantity'
    },
    {
      value: 'amount',
      label: 'Amount'
    },
    {
      value: 'repurchaseDate',
      label: 'Repurchase Date'
    },
    {
      value: 'repurchaseAmount',
      label: 'Repurchase Amount'
    },
    {
      value: 'deltaRepoIncome',
      label: 'Delta Repo Income'
    },
    {
      value: 'user',
      label: 'User'
    },
    {
      value: 'investor',
      label: 'Investor'
    }
  ];

  initData;
  dataSource;

  @ViewChild(MatSort) sort: MatSort;

  subscription = new Subscription();

  constructor(private myTradesService: MyTradesService,
              private socketService: SocketService,
              private importService: ImportService,
              private formatDataService: FormatDataService) { }

  ngOnInit(): void {
    this.getMyTrades();
    this.subscription.add(this.socketService.messageSubject.subscribe(msg => {
      if (msg === 'trades') {
        this.getMyTrades();
      }
    }));

    this.onDownloadCSVSubject();
  }

  onDownloadCSVSubject() {
    this.subscription.add(this.downloadCSVSubject.subscribe((view) => {
      if (view === 'my-trades') {
        this.importService.json2csv(view, this.dataSource._renderData._value, this.tableColumns);
      }
    }));
  }

  getMyTrades() {
    this.myTradesService.getMyTrades().subscribe(trades => {
      this.initData = this.formatData(trades);
      this.dataSource = new MatTableDataSource(this.initData);
      this.dataSource.sort = this.sort;
    });
  }

  formatData(data) {
    data = data.map(item => {
      item.transactTime = this.formatDataService.toDateTime(item.transactTime);
      item.repoRate = this.formatDataService.toDecimalFour(item.repoRate);
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
