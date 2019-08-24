import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {

  apiUrl = environment.api_url;

  constructor(private http: HttpClient) {
  }

  migrateProcessInstance(migrateObject) {
    return this.http.post(`${this.apiUrl}/service/app/migrate/`, migrateObject);
  }

}
