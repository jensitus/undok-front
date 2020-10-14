import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Theater} from '../model/theater';
import {TheaterMovies} from '../model/theater-movies';
import {TheaterSchedules} from '../model/theater-schedules';

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

  public getTheater(id: number): Observable<Theater> {
    return this.http.get<Theater>(this.cineApiUrl + '/theaters/' + id);
  }

  public getTheaterSchedules(id: number): Observable<TheaterSchedules> {
    return this.http.get<TheaterSchedules>(this.cineApiUrl + '/theaters/' + id + '/schedules/');
  }

  public getTheaterSchedulesMovies(id: number): Observable<any> {
    return this.http.get<any>(this.cineApiUrl + '/theaters/' + id + '/schedules/movies/');
  }

}
