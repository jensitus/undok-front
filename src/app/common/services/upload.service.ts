import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  apiUrl = environment.api_url;

  constructor(
    private http: HttpClient
  ) { }

  schickDasBild (bild) {
    const formData = new FormData();
    formData.append('file', bild);
    return this.http.post(`${this.apiUrl}/service/app/files`, formData);
  }

}
