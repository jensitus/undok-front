import {Injectable, OnDestroy, PipeTransform} from '@angular/core';
import {SortColumn, SortDirection} from './sortable.directive';
import {BehaviorSubject, Observable, of, Subject, Subscription} from 'rxjs';
import {State} from './state';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {AllClient} from '../model/all-client';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CommonService} from '../../common/services/common.service';
import {ClientForTable} from '../model/client-for-table';

export interface SearchResult {
  clients: AllClient[];
  total: number;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(clients: ClientForTable[], column: SortColumn, direction: string): ClientForTable[] {
  if (direction === '' || column === '') {
    return clients;
  } else {
    return [...clients].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(client: ClientForTable, term: string, pipe: PipeTransform) {
  if (client.firstName === null) {
    client.firstName = '...';
  }
  if (client.lastName === null) {
    client.lastName = '...';
  }
  if (client.sector === null) {
    client.sector = '...';
  }
  if (client.currentResidentStatus === null) {
    client.currentResidentStatus = '...';
  }
  if (client.nationality === null) {
    client.nationality = '...';
  }
  return client.firstName.toLowerCase().includes(term.toLowerCase())
    || client.lastName.toLowerCase().includes(term.toLowerCase())
    || client.keyword.toLowerCase().includes(term.toLowerCase())
    || client.sector.toLowerCase().includes(term.toLowerCase())
    || client.currentResidentStatus.toLocaleLowerCase().includes(term.toLowerCase())
    || client.nationality.toLowerCase().includes(term.toLowerCase());
}

@Injectable({
  providedIn: 'root'
})
export class ClientTableService implements OnDestroy {

  apiUrl = environment.api_url;
  UNDOK_CLIENTS = '/service/undok/clients';
  UNDOK_DASHBOARD = '/dashboard';

  allClients: ClientForTable[];

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _clients$ = new BehaviorSubject<ClientForTable[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private subscription$: Subscription[] = [];

  private _state: State = {
    page: 1,
    pageSize: 40,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(
    private pipe: DecimalPipe,
    private http: HttpClient,
    private commonService: CommonService
  ) {
    this.getDeleteClientSubject();
    this.getClientsConstructor();
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  getClientsConstructor() {
    console.log('get clients for the fucking table');
    this.subscription$.push(
      this.getAllClients().subscribe(result => {
        this.allClients = result;
        this._search$.pipe(tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search()),
          delay(200),
          tap(() => this._loading$.next(false))
        ).subscribe(r => {
          this._clients$.next(r.clients);
          this._total$.next(r.total);
        });
        this._search$.next();
      })
    );
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

  private _search(): Observable<{ total: number; clients: ClientForTable[] }> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
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

  getAllClients(): Observable<ClientForTable[]> {
    console.log('get clients for the fucking table');
    return this.http.get<ClientForTable[]>(this.apiUrl + this.UNDOK_CLIENTS + '/overview');
  }

  getDeleteClientSubject() {
    this.commonService.reloadSubject.subscribe(relClSub => {
      if (relClSub) {
        this.getClientsConstructor();
      }
    });
  }


}
