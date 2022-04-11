import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-choose-view',
  templateUrl: './choose-view.component.html',
  styleUrls: ['./choose-view.component.css']
})
export class ChooseViewComponent implements OnInit {
  @Input() view  = '';
  @Output() removeView = new EventEmitter();
  @Output() addView = new EventEmitter();
  @Output() selectView = new EventEmitter();
  downloadCSVSubject = new Subject();
  isSearchShown = false;

  constructor() { }

  ngOnInit(): void {
  }

  get label() {
    return this.view.replace('-', ' ').toUpperCase();
  }

  downloadCSV(view) {
    this.downloadCSVSubject.next(view);
  }

  get isDownloadCSVAvailable() {
    return this.view === 'market-view' ||
           this.view === 'market-trades' ||
           this.view === 'my-trades' ||
           this.view === 'my-orders';
  }

  toggleSearch() {
    this.isSearchShown = !this.isSearchShown;
  }

}
