import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Category} from '../model/category';
import {JoinCategory} from '../model/join-category';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {joinTestLogs} from 'protractor/built/util';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiUrl = environment.api_url;
  UNDOK_CATEGORIES = '/service/undok/categories';
  UNDOK_BY_TYPE = '/by-type/';
  CREATE = '/create';
  ADD_JOIN_CATEGORY = '/add-join-category';

  constructor(
    private http: HttpClient
  ) { }

  getCategories(type: string): Observable<any> {
    return this.http.get(this.apiUrl + this.UNDOK_CATEGORIES + this.UNDOK_BY_TYPE + type);
  }

  addCategory(category: Category): Observable<any> {
    return this.http.post(this.apiUrl + this.UNDOK_CATEGORIES + this.CREATE, category);
  }

  addJoinCategories(joinCategories: JoinCategory[]): Observable<any> {
    return this.http.post(this.apiUrl + this.UNDOK_CATEGORIES + this.ADD_JOIN_CATEGORY, joinCategories);
  }

  getCategoriesByTypeAndEntity(type: string, entity_id: string): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl + this.UNDOK_CATEGORIES + `/type/${type}/entity/${entity_id}`);
  }

  deleteJoinCategories(joinCategories: JoinCategory[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: joinCategories
    };
    return this.http.delete<any>(this.apiUrl + this.UNDOK_CATEGORIES + '/join-categories', options);
  }

}
