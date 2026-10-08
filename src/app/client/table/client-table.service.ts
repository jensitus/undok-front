import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AllClient} from '../model/all-client';
import {Category} from '../model/category';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

function categoryNames(categories: Category[] | undefined): string {
  return (categories ?? []).map(c => c.name).join(', ');
}

/** Aufenthaltstitel is single-select, but it arrives as a list from join_category. */
export function residenceStatusNames(client: AllClient): string {
  return categoryNames(client.residenceStatus);
}

/** Sektor is multi-select and arrives as a list from join_category. */
export function sectorNames(client: AllClient): string {
  return categoryNames(client.sector);
}

/**
 * Free-text match across the columns the clients table shows. Pure: the previous version
 * rewrote null names to '...' on the client objects themselves, which corrupted the data it
 * was filtering.
 */
export function matchesClient(client: AllClient, term: string): boolean {
  const needle = term.toLowerCase();
  return [
    client.firstName,
    client.lastName,
    client.keyword,
    client.nationality,
    sectorNames(client),
    residenceStatusNames(client)
  ].some(value => (value ?? '').toLowerCase().includes(needle));
}

/**
 * Data source for the clients table. Filtering, grouping and pagination live in
 * ShowClientsComponent as signals — the list is split into open and closed cases, and the two
 * sections page independently, which a single shared state object could not express.
 */
@Injectable({
  providedIn: 'root'
})
export class ClientTableService {

  apiUrl = environment.api_url;
  UNDOK_CLIENTS = '/service/undok/clients';

  constructor(private http: HttpClient) {
  }

  getAllClients(): Observable<AllClient[]> {
    return this.http.get<AllClient[]>(this.apiUrl + this.UNDOK_CLIENTS + '/all');
  }

}
