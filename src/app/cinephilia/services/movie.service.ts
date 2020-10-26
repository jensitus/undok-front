import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Movie} from '../model/movie';
import {environment} from '../../../environments/environment';

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
}
