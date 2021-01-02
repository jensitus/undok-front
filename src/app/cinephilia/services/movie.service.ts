import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Movie} from '../model/movie';
import {environment} from '../../../environments/environment';
import {Schedule} from '../model/schedule';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  cineApiUrl = environment.cine_api_url;

  constructor(
    private httpClient: HttpClient
  ) { }

  public getSingleMovie(id: number): Observable<Movie> {
    return this.httpClient.get<Movie>(this.cineApiUrl + '/movies/' + id);
  }

  public getMovieScheduleTheaters(id: number): Observable<Map<string, Map<string, Schedule[]>>> {
    return this.httpClient.get<Map<string, Map<string, Schedule[]>>>(this.cineApiUrl + '/movies/' + id + '/schedules/theaters');
  }
}
