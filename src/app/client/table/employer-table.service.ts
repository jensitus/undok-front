import {Injectable, PipeTransform} from '@angular/core';
import {SortColumn, SortDirection} from './sortable.directive';
import {Employer} from '../model/employer';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {State} from './state';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {EmployerService} from '../service/employer.service';
import {CommonService} from '../../common/services/common.service';

interface SearchResult {
  employers: Employer[];
  total: number;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(employers: Employer[], column: SortColumn, direction: string): Employer[] {
  if (direction === '' || column === '') {
    return employers;
  } else {
    return [...employers].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(employer: Employer, term: string, pipe: PipeTransform) {
  if (employer.person.firstName === null) {
    employer.person.firstName = '  ';
  }
  if (employer.person.lastName === null) {
    employer.person.lastName = '  ';
  }
  if (employer.company === null) {
    employer.company = '  ';
  }
  if (employer.position === null) {
    employer.position = '  ';
  }
  return employer.person.firstName.toLowerCase().includes(term.toLowerCase())
    || employer.person.lastName.toLowerCase().includes(term.toLowerCase())
    || employer.company.toLowerCase().includes(term.toLowerCase())
    || employer.position.toLowerCase().includes(term.toLowerCase());
}

@Injectable({
  providedIn: 'root'
})
export class EmployerTableService {

  employers: Employer[];

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _employers$ = new BehaviorSubject<Employer[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(
    private pipe: DecimalPipe,
    private employerService: EmployerService,
    private commonService: CommonService
  ) {
    this.constructEmployersObs();
    this.getCreateEmployerSubject();
  }

  get employers$() {
    return this._employers$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let emps = sort(this.employers, sortColumn, sortDirection);

    // 2. filter
    emps = emps.filter(employer => matches(employer, searchTerm, this.pipe));
    const total = emps.length;

    // 3. paginate
    emps = emps.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({employers: emps, total});
  }

  private constructEmployersObs() {
    this.employerService.getAllEmployers(null).pipe().subscribe(employers => {
      this.employers = employers;

      this._search$.pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      ).subscribe(result => {
        this._employers$.next(result.employers);
        this._total$.next(result.total);
      });

      this._search$.next();
    });
  }

  getCreateEmployerSubject() {
    this.commonService.createEmployerSubject.pipe(takeUntil(this.unsubscribe$)).subscribe(reload => {
      if (reload === true) {
        console.log('employerTableService.getCreateEmployerSubject()');
        this.constructEmployersObs();
      }
    });
  }

}
