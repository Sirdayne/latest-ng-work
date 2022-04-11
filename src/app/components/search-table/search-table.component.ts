import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() tableColumns;
  @Input() initData;
  @Input() isSearchShown;
  @Output() setFilteredData = new EventEmitter();
  searchControl = new FormControl();
  searchByControl = new FormControl();
  subscription = new Subscription();

  constructor() { }

  ngOnInit(): void {
    this.onSearchChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.initData) {
      if (this.searchControl && this.searchControl.value && this.searchByControl && this.searchByControl.value) {
        this.filterData(this.searchControl.value, this.searchByControl.value);
      }
    }

    if (changes.tableColumns) {
      this.searchByControl.patchValue(this.tableColumns[0].value);
    }

    if (changes.isSearchShown) {
      this.searchControl.patchValue('');
    }
  }

  onSearchChange() {
    this.subscription.add(
      this.searchControl.valueChanges.subscribe(search => {
        this.filterData(search, this.searchByControl.value);
      })
    );

    this.subscription.add(
      this.searchByControl.valueChanges.subscribe(searchBy => {
        this.filterData(this.searchControl.value, searchBy);
      })
    );
  }

  filterData(search = '', searchBy) {
    if (search && searchBy) {
      const data = this.initData.filter(item => String(item[searchBy]).toLowerCase().includes(search.toLowerCase()));
      this.setFilteredData.emit(data);
    } else {
      this.setFilteredData.emit(this.initData);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
