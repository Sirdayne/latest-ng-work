import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-title',
  templateUrl: './table-title.component.html',
  styleUrls: ['./table-title.component.css']
})
export class TableTitleComponent implements OnInit {
  @Input() label: string;

  constructor() { }

  ngOnInit(): void {
  }

}
