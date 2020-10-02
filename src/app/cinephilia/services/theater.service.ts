import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Theater} from '../model/theater';

@Injectable({
  providedIn: 'root'
})
export class TheaterService {

  cineApiUrl = environment.cine_api_url;

  constructor(
    private http: HttpClient
  ) { }

  public getTheaterList(): Observable<Theater[]> {
    const url = `${this.cineApiUrl}/theaters/`;
    console.log('url', url);
    return this.http.get<Theater[]>(`${this.cineApiUrl}/theaters/`);
  }

}
