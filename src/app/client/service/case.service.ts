import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Case} from '../model/case';
import {CloseCaseForm} from '../model/close-case-form';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaseService {

  apiUrl = environment.api_url;

  constructor(private http: HttpClient) { }

  getCase(id: string): Observable<Case> {
    return this.http.get<Case>(this.apiUrl + '/service/undok/case/' + id);
  }

  closeCase(caseId: string, form: CloseCaseForm): Observable<Case> {
    return this.http.put<Case>(this.apiUrl + '/service/undok/case/' + caseId + '/close', form);
  }

  newCase(newCase: Case): Observable<Case> {
    return this.http.post<Case>(this.apiUrl + '/service/undok/case', newCase);
  }

}
