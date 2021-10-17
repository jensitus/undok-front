import {Injectable, PipeTransform} from '@angular/core';
import {SortColumn, SortDirection} from './sortable.directive';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {State} from './state';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {AllClient} from '../model/all-client';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export interface SearchResult {
  clients: AllClient[];
  total: number;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(clients: AllClient[], column: SortColumn, direction: string): AllClient[] {
  if (direction === '' || column === '') {
    return clients;
  } else {
    return [...clients].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(client: AllClient, term: string, pipe: PipeTransform) {
  if (client.firstName === null) {
    client.firstName = '...';
  } else if (client.lastName === null) {
    client.lastName = '...';
  }
  return client.firstName.toLowerCase().includes(term.toLowerCase())
    || client.lastName.toLowerCase().includes(term.toLowerCase())
    || client.keyword.toLowerCase().includes(term.toLowerCase());
}

@Injectable({
  providedIn: 'root'
})
export class ClientTableService {

  apiUrl = environment.api_url;
  UNDOK_CLIENTS = '/service/undok/clients';
  UNDOK_DASHBOARD = '/dashboard';

  // clients: AllClient[];
  allClients: AllClient[];

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _clients$ = new BehaviorSubject<AllClient[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(
    private pipe: DecimalPipe,
    private http: HttpClient
  ) {
    this.getAllClients().subscribe(result => {
      console.log('constructor result', result);
      this.allClients = result;
      console.log('constructor this.allClients', this.allClients);
    });
    this._search$.pipe(tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._clients$.next(result.clients);
      this._total$.next(result.total);
    });
    this._search$.next();
  }

  get allClients$() {
    return this.allClients;
  }

  get clients$() {
    return this._clients$.asObservable();
  }

  get total$() {
    return this._total$.asObservable();
  }

  get loading$() {
    return this._loading$.asObservable();
  }

  get page() {
    return this._state.page;
  }

  get pageSize() {
    return this._state.pageSize;
  }

  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({page});
  }

  set pageSize(pageSize: number) {
    this._set({pageSize});
  }

  set searchTerm(searchTerm: string) {
    this._set({searchTerm});
  }

  set sortColumn(sortColumn: SortColumn) {
    this._set({sortColumn});
  }

  set sortDirection(sortDirection: SortDirection) {
    this._set({sortDirection});
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    console.log('this.customers: ', this.allClients);
    let c = sort(this.allClients, sortColumn, sortDirection);

    // 2. filter
    c = c.filter(client => matches(client, searchTerm, this.pipe));
    const total = c.length;

    // 3. paginate
    c = c.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({clients: c, total});
  }

  // public getClients(customers: AllClient[]) {
  //   this.customers = customers;
  // }

  getAllClients(): Observable<AllClient[]> {
    return this.http.get<AllClient[]>(this.apiUrl + this.UNDOK_CLIENTS + '/all/');
  }

}
