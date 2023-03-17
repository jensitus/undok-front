import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  CSV_EXTENSION = '.csv';
  CSV_TYPE = 'text/plain;charset=utf-8';
  apiUrl = environment.api_url;
  COUNSELING_URL = '/service/undok/counselings';

  constructor(
    private http: HttpClient
  ) { }

  public downloadCsv(): Observable<Blob> {
    return this.http.get(this.apiUrl + this.COUNSELING_URL + '/csv', {responseType: 'blob'});
  }

  private saveAsFile(buffer: any, fileName: string, fileType: string): void {
    const data: Blob = new Blob([buffer], { type: fileType });
    FileSaver.saveAs(data, fileName);
  }

  public exportToCsv(rows: object[], fileName: string, columns?: string[]): string {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]).filter(k => {
      if (columns?.length) {
        return columns.includes(k);
      } else {
        return true;
      }
    });
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');
    this.saveAsFile(csvContent, `${fileName}${this.CSV_EXTENSION}`, this.CSV_TYPE);
  }

}
