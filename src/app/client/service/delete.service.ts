import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as http from 'http';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  private apiUrl = environment.api_url;
  private CLIENT_PATH = '/service/undok/clients/';
  private EMPLOYER_PATH = '/service/undok/employers/';

  constructor(
    // tslint:disable-next-line:no-shadowed-variable
    private http: HttpClient
  ) {}

  deleteClient(id: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + this.CLIENT_PATH + id + '/set-deleted');
  }

  deleteEmployer(id: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + this.EMPLOYER_PATH + id + '/set-deleted');
  }

}
