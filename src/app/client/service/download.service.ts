import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {response} from 'express';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  apiUrl = environment.api_url;
  DOWNLOAD_URL = '/service/undok/download/';

  constructor(private http: HttpClient) { }

  downloadClientCsv(file: string | undefined): Observable<Blob> {
    return this.http.get(this.apiUrl +  this.DOWNLOAD_URL + file, {responseType: 'blob'});
  }
// donner wetter
}
