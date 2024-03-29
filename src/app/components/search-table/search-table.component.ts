import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() tableColumns;
  @Input() isSearchShown;
  @Output() refetchEntities = new EventEmitter();
  searchControl = new FormControl();
  searchByControl = new FormControl();
  subscription = new Subscription();

  constructor() { }

  ngOnInit(): void {
    this.onSearchChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tableColumns) {
      this.searchByControl.patchValue(this.tableColumns[0].value);
    }

    if (changes.isSearchShown) {
      this.searchControl.patchValue('');
    }
  }

  onSearchChange() {
    this.subscription.add(
      this.searchControl.valueChanges.pipe(
        debounceTime(1500),
        distinctUntilChanged(),
      ).subscribe(search => {
        this.filterData(search, this.searchByControl.value);
      })
    );

    this.subscription.add(
      this.searchByControl.valueChanges.subscribe(searchBy => {
        this.filterData(this.searchControl.value, searchBy);
      })
    );
  }

  filterData(search = '', searchBy = '') {
    this.refetchEntities.emit({ value: search, column: searchBy });
  }

  reset() {
    this.searchByControl.reset();
    this.searchControl.reset();
    this.refetchEntities.emit({ value: '', column: '' });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
