import { Injectable } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { NoCommaPipe } from '../core/pipes/noComma.pipe';

@Injectable({
  providedIn: 'root'
})
export class FormatDataService {

  constructor(private datePipe: DatePipe,
              private decimalPipe: DecimalPipe,
              private noCommaPipe: NoCommaPipe) {}

  toDate(date) {
    let output = this.datePipe.transform(date);
    if (output) {
      output = this.noCommaPipe.transform(output);
    }
    return output;
  }

  toDateTime(date) {
    let output = this.datePipe.transform(date,'short');
    if (output) {
      output = this.noCommaPipe.transform(output);
    }
    return output;
  }

  toDecimalFour(number) {
    let output = this.decimalPipe.transform(number,'1.0-4');
    if (output) {
      output = this.noCommaPipe.transform(output);
    }
    return output;
  }

  toDecimalTwo(number) {
    let output = this.decimalPipe.transform(number,'1.2-2');
    if (output) {
      output = this.noCommaPipe.transform(output);
    }
    return output;
  }

  camelToSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}
