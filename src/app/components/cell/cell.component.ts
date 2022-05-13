import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit, OnChanges {
  @Input() current;
  @Input() prev;
  @Input() currentWithPercent = false;

  isHovered = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.current && changes.prev) {
      this.isHovered = false;
    }
  }

  get isHighlight() {
    return !this.isHovered && this.current && this.prev && this.current !== this.prev;
  }
}
