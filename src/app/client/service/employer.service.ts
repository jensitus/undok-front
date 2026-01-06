import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmployerForm } from '../model/employer-form';
import { ClientEmployerForm } from '../model/client-employer-form';
import { Employer } from '../model/employer';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.api_url;
  private readonly EMPLOYERS_URL = '/service/undok/employers/';

  createEmployer(employerForm: EmployerForm): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/service/undok/employers/create`,
      employerForm
    );
  }

  getAllEmployers(clientId?: string): Observable<any> {
    let params = new HttpParams();

    if (clientId) {
      params = params.set('client_id', clientId);
    }

    const url = `${this.apiUrl}/service/undok/employers/all/`;

    return this.http.get<any>(url, { params });
  }

  getEmployersForClient(clientId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/service/undok/employers/${clientId}/by-client`
    );
  }

  setEmployerToClient(employerId: string, clientId: string): Observable<any> {
    const clientEmpForm = {
      employerId,
      clientId
    };

    return this.http.post(
      `${this.apiUrl}/service/undok/client/employers/${employerId}/client/${clientId}/create`,
      clientEmpForm
    );
  }

  deleteEmployerFromClient(employerId: string, clientId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/service/undok/client/employers/${employerId}/client/${clientId}/delete`
    );
  }

  checkClientEmployer(employerId: string, clientId: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/service/undok/client/employers/${employerId}/client/${clientId}/present`
    );
  }

  getNumberOfEmployers(): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/service/undok/employers/count`
    );
  }

  createClientEmployer(clientEmployerForm: ClientEmployerForm): Observable<any> {
    const url = `${this.apiUrl}/service/undok/client/employers/${clientEmployerForm.employerId}/client/${clientEmployerForm.clientId}/create`;

    return this.http.post<any>(url, clientEmployerForm);
  }

  updateClientEmployer(clientEmployerForm: ClientEmployerForm): Observable<any> {
    const url = `${this.apiUrl}/service/undok/client/employers/${clientEmployerForm.employerId}/client/${clientEmployerForm.clientId}`;

    return this.http.put<any>(url, clientEmployerForm);
  }

  getSingleEmployer(id: string): Observable<Employer> {
    return this.http.get<Employer>(`${this.apiUrl}${this.EMPLOYERS_URL}${id}`);
  }

  updateEmployer(id: string, employer: Employer): Observable<Employer> {
    return this.http.put<Employer>(
      `${this.apiUrl}${this.EMPLOYERS_URL}${id}`,
      employer
    );
  }
}
