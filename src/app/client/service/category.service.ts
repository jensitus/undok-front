import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Category} from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiUrl = environment.api_url;
  UNDOK_CATEGORIES = '/service/undok/categories';
  UNDOK_BY_TYPE = '/by-type/';
  CREATE = '/create';

  constructor(
    private http: HttpClient
  ) { }

  getCategories(type: string): Observable<any> {
    return this.http.get(this.apiUrl + this.UNDOK_CATEGORIES + this.UNDOK_BY_TYPE + type);
  }

  addCategory(category: Category): Observable<any> {
    return this.http.post(this.apiUrl + this.UNDOK_CATEGORIES + this.CREATE, category);
  }

}
