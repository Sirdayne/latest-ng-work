import { Injectable } from '@angular/core';
import { Parser } from 'json2csv';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor() { }

  json2csv(filename, json, columns, delimiter = ';') {
    const json2csvParser = new Parser({ fields: columns, delimiter });
    const csv = json2csvParser.parse(json);
    const csvContent = 'data:text/csv;charset=utf-8,' + csv;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const today = new Date();
    link.setAttribute('download', `${filename}-${today.toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
  }

  saveExcel(filename, blob) {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    const today = new Date();
    link.download = `${filename}-${today.toLocaleDateString()}.xlsx`;
    link.click();
  }
}
