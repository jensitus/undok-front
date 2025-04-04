import {Injectable} from '@angular/core';
import {EmployerForm} from '../model/employer-form';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ClientEmployerForm} from '../model/client-employer-form';
import {Employer} from '../model/employer';
import {isNull, isUndefined} from '../../common/helper/comparison-utils';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  apiUrl = environment.api_url;

  EMPLOYERS_URL = '/service/undok/employers/';

  constructor(
    private http: HttpClient
  ) {
  }

  createEmployer(employerForm: EmployerForm): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/service/undok/employers/create', employerForm);
  }

  getAllEmployers(clientId: string): Observable<any> {
    let url: string;
    if (isUndefined(clientId) || isNull(clientId)) {
      url = '/service/undok/employers/all/';
    } else {
      url = '/service/undok/employers/all/?client_id=' + clientId;
    }
    console.log('url', url);
    return this.http.get<any>(this.apiUrl + url);
  }

  getEmployersForClient(clientId: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/service/undok/employers/' + clientId + '/by-client');
  }

  setEmployerToClient(employerId: string, clientId: string): Observable<any> {
    const clientEmpForm = {
      employerId: employerId,
      clientId: clientId
    };
    return this.http.post(this.apiUrl + '/service/undok/client/employers/' + employerId + '/client/' + clientId + '/create', clientEmpForm);
  }

  deleteEmployerFromClient(employerId: string, clientId: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/service/undok/client/employers/' + employerId + '/client/' + clientId + '/delete');
  }

  checkClientEmployer(employerId: string, clientId: string): Observable<boolean> {
    return this.http.get<boolean>(this.apiUrl + '/service/undok/client/employers/' + employerId + '/client/' + clientId + '/present');
  }

  getNumberOfEmployers(): Observable<number> {
    return this.http.get<number>(this.apiUrl + '/service/undok/employers/count');
  }

  createClientEmployer(clientEmployerForm: ClientEmployerForm): Observable<any> {
    console.log('service', clientEmployerForm);
    const url =
      this.apiUrl + '/service/undok/client/employers/' + clientEmployerForm.employerId + '/client/' + clientEmployerForm.clientId + '/create';
    console.log('url', url);
    return this.http.post<any>(url, clientEmployerForm);
  }

  updateClientEmployer(clientEmployerForm: ClientEmployerForm): Observable<any> {
    const url = this.apiUrl + '/service/undok/client/employers/' + clientEmployerForm.employerId + '/client/' + clientEmployerForm.clientId;
    return this.http.put<any>(url, clientEmployerForm);
  }

  getSingleEmployer(id: string): Observable<Employer> {
    return this.http.get<Employer>(this.apiUrl + this.EMPLOYERS_URL + id);
  }

  updateEmployer(id: string, employer: Employer): Observable<Employer> {
    return this.http.put<Employer>(this.apiUrl + this.EMPLOYERS_URL + id, employer);
  }

}
