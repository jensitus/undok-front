import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ClientForm} from '../model/clientForm';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Person} from '../model/person';
import {CounselingForm} from '../model/counseling-form';
import {Client} from '../model/client';
import {CountryData} from '../../admin-template/layout/charts/doughnut/country-data';
import {AllClient} from '../model/all-client';
import {ResponseMessage} from '../../common/helper/response-message';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  apiUrl = environment.api_url;
  UNDOK_CLIENTS = '/service/undok/clients';
  UNDOK_DASHBOARD = '/dashboard';

  constructor(
    private http: HttpClient
  ) { }

  createClient(client: ClientForm): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/service/undok/clients/create', client);
  }

  updateClient(clientId: string, client: ClientForm): Observable<ResponseMessage> {
    console.log(client);
    return this.http.post<ResponseMessage>(this.apiUrl + '/service/undok/clients/' + clientId + '/update', client);
  }

  getAllClientsPaginated(): Observable<AllClient[]> {
    return this.http.get<AllClient[]>(this.apiUrl + '/service/undok/clients/all/');
  }

    getSingleClient(id: string | undefined): Observable<any> {
    return this.http.get<Person>(this.apiUrl + '/service/undok/clients/' + id);
  }

  createCounseling(clientId: string, counselingForm: CounselingForm): Observable<any> {
    return this.http.post(this.apiUrl + '/service/undok/clients/' + clientId + '/counseling', counselingForm );
  }

  numberOfCounselings(): Observable<number> {
    return this.http.get<number>(this.apiUrl + '/service/undok/counselings/count');
  }

  numberOfClients(): Observable<number> {
    return this.http.get<number>(this.apiUrl + '/service/undok/clients/count');
  }

  getItemForTimeline(): Observable<any> {
    return this.http.get<any>(this.apiUrl + this.UNDOK_DASHBOARD + '/timeline/items');
  }

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl + this.UNDOK_CLIENTS + '/all');
  }

  getCountryDataForCharts(): Observable<CountryData> {
    return this.http.get<CountryData>(this.apiUrl + this.UNDOK_DASHBOARD + '/chart/country-chart-data');
  }

}
