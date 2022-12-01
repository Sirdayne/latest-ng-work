import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { MyTradesService } from './my-trades.service';
import { SocketService } from '../home/socket.service';
import {merge, of, Subject, Subscription} from 'rxjs';
import { ImportService } from '../../shared/import.service';
import { FormatDataService } from '../../shared/format-data.service';
import {MatSort} from '@angular/material/sort';
import {filter, finalize, switchMap} from 'rxjs/operators';
import {MatPaginator} from "@angular/material/paginator";
import {FilterTableI} from "../../models/filter-table.interface";

@Component({
  selector: 'app-my-trades',
  templateUrl: './my-trades.component.html',
  styleUrls: ['./my-trades.component.css']
})
export class MyTradesComponent implements AfterViewInit, OnDestroy {
  @Input() downloadCSVSubject: Subject<any>;
  @Input() isSearchShown;
  @Output() setLoading = new EventEmitter();

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
      value: 'trdMatchId',
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
      value: 'tradeRate',
      label: 'Rate'
    },
    {
      value: 'tradeQty',
      label: 'Quantity'
    },
    {
      value: 'tradeAmount',
      label: 'Amount'
    },
    {
      value: 'repurchaseDate',
      label: 'Repurchase Date'
    },
    {
      value: 'tradeRepurchaseAmount',
      label: 'Repurchase Amount'
    },
    {
      value: 'deltaRepoIncome',
      label: 'Delta Repo Income'
    },
    {
      value: 'username',
      label: 'User'
    },
    {
      value: 'investor',
      label: 'Investor'
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

  constructor(private myTradesService: MyTradesService,
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
      filter(msg => msg === 'trades'),
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
      if (view === 'my-trades') {
        this.myTradesService.downloadExcel().subscribe(res => {
          this.importService.saveExcel('my-trades', res);
        })
      }
    }));
  }

  fetchData() {
    return this.myTradesService.getMyTrades(
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
      item.tradeRate = this.formatDataService.toDecimalFour(item.tradeRate);
      item.tradeAmount = this.formatDataService.toDecimalTwo(item.tradeAmount);
      item.repurchaseDate = this.formatDataService.toDate(item.repurchaseDate);
      item.tradeRepurchaseAmount = this.formatDataService.toDecimalTwo(item.tradeRepurchaseAmount);
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
