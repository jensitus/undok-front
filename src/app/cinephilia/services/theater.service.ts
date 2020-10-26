import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Theater} from '../model/theater';
import {TheaterMovies} from '../model/theater-movies';
import {TheaterSchedules} from '../model/theater-schedules';
import {Schedule} from '../model/schedule';
import {Movie} from '../model/movie';

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

  public getTheaterSchedules(id: number): Observable<Map<string, Map<string, Schedule[]>>> {
    return this.http.get<Map<string, Map<string, Schedule[]>>>(this.cineApiUrl + '/theaters/' + id + '/schedules/');
  }

  public getTheaterSchedulesMovies(id: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.cineApiUrl + '/theaters/' + id + '/schedules/movies/');
  }

}
