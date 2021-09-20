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

  COUNSELING_URL = '/service/undok/counselings/';

  constructor(private http: HttpClient) { }

  getCounselings(): Observable<any> {
    return this.http.get<any>(this.apiUrl + this.COUNSELING_URL + 'all');
  }

  updateCounseling(counselingId: string, counseling: Counseling): Observable<Counseling> {
    return this.http.put<Counseling>(this.apiUrl + this.COUNSELING_URL + counselingId + '/update', counseling);
  }

  createUpdateComment(counselingId: string, comment: string): Observable<Counseling> {
    return this.http.put<Counseling>(this.apiUrl + this.COUNSELING_URL + counselingId + '/set-or-update-comment/', comment);
  }

}
