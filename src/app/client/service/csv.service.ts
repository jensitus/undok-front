import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  apiUrl = environment.api_url;
  SERVICE_UNDOK_CSV = '/service/undok/csv';

  constructor(
    private http: HttpClient
  ) { }

  public downloadCsv(url): Observable<Blob> {
    return this.http.get(this.apiUrl + url + '/csv', {responseType: 'blob'});
  }

  public getCsvList(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + this.SERVICE_UNDOK_CSV + '/fileNames');
  }

  public getBackUpCsv(fileName): Observable<Blob> {
    return this.http.get(this.apiUrl + this.SERVICE_UNDOK_CSV + '/backupCsv/' + fileName, {responseType: 'blob'});
  }

}
