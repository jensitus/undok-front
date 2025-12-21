import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Counseling} from '../model/counseling';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CounselingService {

  apiUrl = environment.api_url;

  COUNSELING_URL = '/service/undok/counselings/';

  constructor(private http: HttpClient) { }

  getCounselings(): Observable<any> {
    return this.http.get<any>(this.apiUrl + this.COUNSELING_URL + 'all');
  }

  updateCounseling(counselingId: string, counseling: Counseling): Observable<Counseling> {
    return this.http.put<Counseling>(this.apiUrl + this.COUNSELING_URL + counselingId + '/update', counseling);
  }

  createUpdateComment(counselingId: string, comment: string): Observable<Counseling> {
    console.log(counselingId, comment);
    return this.http.put<Counseling>(this.apiUrl + this.COUNSELING_URL + counselingId + '/set-or-update-comment/', comment, {
      headers: {
        'Content-Type': 'text/plain'
      }});
  }

  deleteCounseling(counselingId: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl + this.COUNSELING_URL + counselingId);
  }

  getCounseling(counselingId: string): Observable<Counseling> {
    return this.http.get<Counseling>(this.apiUrl + this.COUNSELING_URL + counselingId);
  }

  setCounselingDuration(counselingId: string, duration: number): Observable<Counseling> {
    return this.http.put<Counseling>(this.apiUrl + this.COUNSELING_URL + counselingId + '/set-required-time', duration);
  }

  getCounselingsByClientId(clientId: string, order: string): Observable<Counseling[]> {
    return this.http.get<Counseling[]>(this.apiUrl + this.COUNSELING_URL + 'by-client/' + clientId + '/order/' + order);
  }

}
