import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MyOrdersService } from './my-orders.service';
import {catchError, filter, finalize, map, startWith, switchMap} from 'rxjs/operators';
import { SocketService } from '../home/socket.service';
import {merge, of, Subject, Subscription} from 'rxjs';
import { ImportService } from '../../shared/import.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormatDataService } from '../../shared/format-data.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {FilterTableI} from "../../models/filter-table.interface";

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements AfterViewInit, OnDestroy {
  @Input() downloadCSVSubject: Subject<any>;
  @Input() isSearchShown;
  @Input() isFirmViewer;
  @Output() setLoading = new EventEmitter();

  tableColumns = [
    {
      value: 'transactTime',
      label: 'Time'
    },
    // {
    //   value: 'clOrdId',
    //   label: 'Client Order Id'
    // },
    {
      value: 'orderId',
      label: 'Order Id'
    },
    {
      value: 'side',
      label: 'Side'
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
      value: 'period',
      label: 'Period'
    },
    {
      value: 'rate',
      label: 'Repo Rate'
    },
    {
      value: 'autoQty',
      label: 'Auto Quantity'
    },
    {
      value: 'autoAmount',
      label: 'Auto Amount'
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
      value: 'type',
      label: 'Order Type'
    },
    {
      value: 'subType',
      label: 'Time In Force'
    },
    {
      value: 'investor',
      label: 'Investor'
    },
    {
      value: 'partialQty',
      label: 'Partial Quantity'
    },
    {
      value: 'partialAmount',
      label: 'Partial Amount'
    },
    {
      value: 'username',
      label: 'User'
    }
  ];
  filterTableColumns;

  data;

  pageSize = 10;
  pageSizeOptions = [10, 20, 50];
  dataLength;
  filters: FilterTableI;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  subscription = new Subscription();

  constructor(private myOrdersService: MyOrdersService,
              private socketService: SocketService,
              private importService: ImportService,
              public dialog: MatDialog,
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
      filter(msg => msg === 'orders'),
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
      if (view === 'my-orders') {
        this.myOrdersService.downloadExcel().subscribe(res => {
          this.importService.saveExcel('my-orders', res);
        })
      }
    }));
  }

  fetchData() {
    return this.myOrdersService.getMyOrders(
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
      item.rate = this.formatDataService.toDecimalFour(item.rate);
      item.autoAmount = this.formatDataService.toDecimalTwo(item.autoAmount);
      item.repurchaseAmount = this.formatDataService.toDecimalTwo(item.repurchaseAmount);
      item.repurchaseDate = this.formatDataService.toDate(item.repurchaseDate);
      item.partialAmount = this.formatDataService.toDecimalTwo(item.partialAmount);
      return item;
    });
    return data;
  }

  cancelOrder(order) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '260px',
      data: {
        id: order.clOrdId,
        title: `Cancel order?`,
        content: `Order Id: ${order.orderId}`
      },
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(clientOrderId => {
        if (clientOrderId) {
          this.myOrdersService.cancelOrder(clientOrderId).subscribe(res => {});
        }
      })
    );
  }

  refetchEntities(filters) {
    this.filters = filters;
    this.paginator.firstPage();
    this.getEntities();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get offset() {
    return this.paginator.pageIndex * this.paginator.pageSize ? this.paginator.pageIndex * this.paginator.pageSize : 0;
  }

  get displayedColumns() {
    const arr = this.tableColumns.map(col => col.value);
    arr.push('actions');
    return arr;
  }
}
