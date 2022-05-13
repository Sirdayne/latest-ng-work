import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MyOrdersService } from './my-orders.service';
import { finalize } from 'rxjs/operators';
import { OrderI } from '../../models/order.interface';
import { SocketService } from '../home/socket.service';
import { Subject, Subscription } from 'rxjs';
import { ImportService } from '../../shared/import.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormatDataService } from '../../shared/format-data.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  @Input() downloadCSVSubject: Subject<any>;
  @Input() isSearchShown;
  @Input() isFirmViewer;

  tableColumns = [
    {
      value: 'transactTime',
      label: 'Time'
    },
    {
      value: 'clOrdId',
      label: 'Client Order Id'
    },
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
      value: 'senderSubId',
      label: 'User'
    }
  ];

  initData;
  dataSource;
  loading = false;

  @ViewChild(MatSort) sort: MatSort;

  subscription = new Subscription();

  constructor(private myOrdersService: MyOrdersService,
              private socketService: SocketService,
              private importService: ImportService,
              public dialog: MatDialog,
              private formatDataService: FormatDataService) { }

  ngOnInit(): void {
    this.getMyOrders();
    this.subscription.add(this.socketService.messageSubject.subscribe(msg => {
      if (msg === 'orders') {
        this.getMyOrders()
      }
    }));

    this.onDownloadCSVSubject();
  }

  onDownloadCSVSubject() {
    this.subscription.add(this.downloadCSVSubject.subscribe(({ view, delimiter }) => {
      if (view === 'my-orders') {
        this.importService.json2csv(view, this.dataSource._renderData._value, this.tableColumns, delimiter);
      }
    }));
  }

  getMyOrders() {
    this.loading = true;
    this.myOrdersService.getMyOrders().pipe(
      finalize(() => this.loading = false)
    ).subscribe(orders => {
      this.initData = this.formatData(orders);
      this.dataSource = new MatTableDataSource(this.initData);
      this.dataSource.sort = this.sort;
    });
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

  get displayedColumns() {
    const arr = this.tableColumns.map(col => col.value);
    arr.push('actions');
    return arr;
  }

  cancelOrder(order) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '260px',
      data: {
        id: order.clOrdId,
        title: `Cancer order?`,
        content: `Order Id: ${order.clOrdId}`
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

  setFilteredData(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
