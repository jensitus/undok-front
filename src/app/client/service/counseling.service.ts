import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Counseling} from '../model/counseling';

@Injectable({
  providedIn: 'root'
})
export class CounselingService {

  apiUrl = environment.api_url;

  constructor(private http: HttpClient) { }

  getCounselings(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/service/undok/counselings/all');
  }

  updateCounseling(counselingId: string, counseling: Counseling): Observable<Counseling> {
    return this.http.put<Counseling>(this.apiUrl + '/service/undok/counselings/' + counselingId + '/update', counseling);
  }

}
