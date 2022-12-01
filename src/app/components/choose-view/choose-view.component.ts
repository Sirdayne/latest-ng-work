import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';

@Component({
  selector: 'app-choose-view',
  templateUrl: './choose-view.component.html',
  styleUrls: ['./choose-view.component.css']
})
export class ChooseViewComponent implements OnInit, OnDestroy {
  @Input() view  = '';
  @Input() isFirmViewer;
  @Output() removeView = new EventEmitter();
  @Output() addView = new EventEmitter();
  @Output() selectView = new EventEmitter();
  downloadCSVSubject = new Subject();
  isSearchShown = false;
  subscription = new Subscription();
  loading = true;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  get label() {
    return this.view.replace('-', ' ').toUpperCase();
  }

  get isNotMarketViewAndOrderEntry() {
    return this.view === 'market-trades' ||
           this.view === 'my-trades' ||
           this.view === 'my-orders';
  }

  get isNotOrderEntry() {
    return this.view === 'market-view' ||
           this.view === 'market-trades' ||
           this.view === 'my-trades' ||
           this.view === 'my-orders';
  }

  toggleSearch() {
    this.isSearchShown = !this.isSearchShown;
  }

  openImportDialog(view) {
    // const dialogRef = this.dialog.open(ImportDialogComponent, {
    //   width: '320px',
    // });
    //
    // this.subscription.add(
    //   dialogRef.afterClosed().subscribe(delimiter => {
    //     if (delimiter) {
    //       this.downloadCSVSubject.next({ view, delimiter });
    //     }
    //   })
    // );

    this.downloadCSVSubject.next({ view });
  }

  setLoading(state) {
    this.loading = state;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
