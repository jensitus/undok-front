import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Page} from '../model/page';
import {Counseling} from '../model/counseling';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private environmentApiUrl = environment.api_url;
  private apiUrl = '/service/undok/counselings/search';
  private http = inject(HttpClient);

  search(query: string,
    page: number = 0,
    size: number = 20,
    dateFrom?: string,
    dateTo?: string): Observable<Page<Counseling>> {
    let params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('size', size.toString());

    if (dateFrom) {
      params = params.set('from', dateFrom);
    }
    if (dateTo) {
      params = params.set('to', dateTo);
    }

    return this.http.get<Page<Counseling>>(this.environmentApiUrl + this.apiUrl, {params});
  }

}
