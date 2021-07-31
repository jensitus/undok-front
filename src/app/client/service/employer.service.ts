import { Injectable } from '@angular/core';
import {EmployerForm} from '../model/employer-form';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  apiUrl = environment.api_url;

  constructor(
    private http: HttpClient
  ) { }

  createEmployer(employerForm: EmployerForm): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/service/undok/employers/create', employerForm);
  }

  getAllEmployers(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/service/undok/employers/all');
  }

  getEmployersForClient(clientId: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/service/undok/employers/' + clientId + '/by-client');
  }

  setEmployerToClient(employerId: string, clientId: string): Observable<any> {
    return this.http.post(this.apiUrl + '/service/undok/client/employers/' + employerId + '/client/' + clientId + '/create', null);
  }

  deleteEmployerFromClient(employerId: string, clientId: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/service/undok/client/employers/' + employerId + '/client/' + clientId + '/delete',);
  }

  checkClientEmployer(employerId: string, clientId: string): Observable<boolean> {
    return this.http.get<boolean>(this.apiUrl + '/service/undok/client/employers/' + employerId + '/client/' + clientId + '/present');
  }

  getNumberOfEmployers(): Observable<number> {
    return this.http.get<number>(this.apiUrl + '/service/undok/employers/count');
  }

}
