import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-value-change',
  templateUrl: './value-change.component.html',
  styleUrls: ['./value-change.component.css']
})
export class ValueChangeComponent implements OnInit {
  @Input() prev;
  @Input() current;

  constructor() { }

  ngOnInit(): void {
  }

}
