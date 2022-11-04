import {Injectable, OnDestroy, PipeTransform} from '@angular/core';
import {SortColumn, SortDirection} from './sortable.directive';
import {BehaviorSubject, Observable, of, Subject, Subscription} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {State} from './state';
import {CounselingService} from '../service/counseling.service';
import {AllCounseling} from '../model/all-counseling';

interface SearchResult {
  counselings: AllCounseling[];
  total: number;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(counselings: AllCounseling[], column: SortColumn, direction: string): AllCounseling[] {
  if (direction === '' || column === '') {
    return counselings;
  } else {
    return [...counselings].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(counseling: AllCounseling, term: string, pipe: PipeTransform) {
  if (counseling.concern === null) {
    counseling.concern = ' ';
  }
  if (counseling.concernCategory === null) {
    counseling.concernCategory = ' ';
  }
  if (counseling.activity === null) {
    counseling.activity = ' ';
  }
  if (counseling.clientFullName === null) {
    counseling.clientFullName = ' ';
  }
  return counseling.concern.toLowerCase().includes(term.toLowerCase())
    || counseling.concernCategory.toLowerCase().includes(term.toLowerCase())
    || counseling.activity.toLowerCase().includes(term.toLowerCase())
    || counseling.keyword.toLowerCase().includes(term.toLowerCase())
    || counseling.clientFullName.toLowerCase().includes(term.toLowerCase());
}

@Injectable({
  providedIn: 'root'
})
export class CounselingTableService implements OnDestroy {

  counselings: AllCounseling[];

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _counselings$ = new BehaviorSubject<AllCounseling[]>([]);
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
    private counselingService: CounselingService
  ) {
    this.subscription$.push(this.counselingService.getCounselings().subscribe(result => {
      this.counselings = result;

      this._search$.pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      ).subscribe(r => {
        this._counselings$.next(r.counselings);
        this._total$.next(r.total);
      });

      this._search$.next();

    }));
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  get allCounselings() {
    return this.counselings;
  }

  get counselings$() {
    return this._counselings$.asObservable();
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
    console.log('this.counsels', this.counselings);
    let couns = sort(this.counselings, sortColumn, sortDirection);

    // 2. filter
    console.log('_search', couns);
    couns = couns.filter(counseling => matches(counseling, searchTerm, this.pipe));
    const total = couns.length;

    // 3. paginate
    couns = couns.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({counselings: couns, total});
  }

}
