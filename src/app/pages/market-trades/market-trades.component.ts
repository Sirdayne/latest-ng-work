import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {merge, of, Subject, Subscription} from 'rxjs';
import { SocketService } from '../home/socket.service';
import { MarketTradesService } from './market-trades.service';
import { ImportService } from '../../shared/import.service';
import { FormatDataService } from '../../shared/format-data.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {filter, finalize, switchMap} from 'rxjs/operators';
import {MatPaginator} from "@angular/material/paginator";
import {FilterTableI} from "../../models/filter-table.interface";

@Component({
  selector: 'app-market-trades',
  templateUrl: './market-trades.component.html',
  styleUrls: ['./market-trades.component.css']
})
export class MarketTradesComponent implements AfterViewInit, OnDestroy {
  @Input() downloadCSVSubject: Subject<any>;
  @Input() isSearchShown;
  @Output() setLoading = new EventEmitter();

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
  filterTableColumns;

  data;

  pageSize = 10;
  pageSizeOptions = [10, 20, 50];
  dataLength;
  filters: FilterTableI;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  subscription = new Subscription();

  constructor(private marketTradesService: MarketTradesService,
              private socketService: SocketService,
              private importService: ImportService,
              private formatDataService: FormatDataService) {
    this.filterTableColumns = this.tableColumns.filter(col => col.value !== 'transactTime');
  }

  ngAfterViewInit(): void {
    this.getEntities();
    this.onSocketMessage();
    this.onPaginate();
    this.onDownloadCSVSubject();
  }

  onSocketMessage() {
    this.subscription.add(this.socketService.messageSubject.pipe(
      filter(msg => msg === 'market_trades'),
      switchMap(() => {
        return this.fetchData();
      })
    ).subscribe((res: any) => {
      if (res) {
        this.setData(res);
      }
    }));
  }

  onPaginate() {
    this.subscription.add(merge(this.paginator.page, this.sort.sortChange).subscribe(() => {
      this.getEntities();
    }));
  }

  onDownloadCSVSubject() {
    this.subscription.add(this.downloadCSVSubject.subscribe(({ view, delimiter }) => {
      if (view === 'market-trades') {
        this.marketTradesService.downloadExcel().subscribe(res => {
          this.importService.saveExcel('market-trades', res);
        })
      }
    }));
  }

  fetchData() {
    return this.marketTradesService.getMarketTrades(
      this.paginator.pageSize,
      this.offset,
      this.filters && this.filters.value ? this.filters.value : '',
      this.filters && this.filters.column ? this.formatDataService.camelToSnakeCase(this.filters.column) : '',
      this.sort && this.sort.active ? this.formatDataService.camelToSnakeCase(this.sort.active) : '',
      this.sort && this.sort.direction ? this.sort.direction : ''
    )
  }

  getEntities() {
    this.setLoading.emit(true);
    this.fetchData().pipe(
      finalize(() => {
        this.setLoading.emit(false);
      })
    ).subscribe((res: any) => {
      this.setData(res);
    }, () => {
      this.data = [];
    });
  }

  setData(res) {
    const items = res && res.items ? res.items : [];
    this.dataLength = res.total;
    this.data = this.formatData(items);
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

  refetchEntities(filters) {
    this.filters = filters;
    this.paginator.firstPage();
    this.getEntities();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get offset() {
    return this.paginator.pageIndex * this.paginator.pageSize ? this.paginator.pageIndex * this.paginator.pageSize : 0;
  }

  get displayedColumns() {
    return this.tableColumns.map(col => col.value);
  }
}
