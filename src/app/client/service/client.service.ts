import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ClientForm} from '../model/clientForm';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Client} from '../model/client';
import {Person} from '../model/person';
import {ClientsCount} from '../model/clients-count';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  apiUrl = environment.api_url;

  constructor(
    private http: HttpClient
  ) { }

  createClient(client: ClientForm): Observable<ClientForm> {
    return this.http.post<ClientForm>(this.apiUrl + '/service/undok/clients/create', client);
  }

  getAllClients(page: number, size: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/service/undok/clients/all/' + page + '/' + size);
  }

  getSingleClient(id: string): Observable<any> {
    return this.http.get<Person>(this.apiUrl + '/service/undok/clients/' + id);
  }

}
