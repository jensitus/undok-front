import {inject, Injectable} from '@angular/core';
import {LanguageResult, NationalityCount} from '../first-counseling-count/first-counseling-count.component';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private http = inject(HttpClient);
  private apiUrl = environment.api_url;

  constructor() { }

  // Counts clients whose first counseling lies within a given date-time range (inclusive)
  // Expects ISO 8601 date-time strings (e.g., 2025-11-23T09:10)
  countFirstCounselingInRange(fromIso: string, toIso: string): Observable<number> {
    const url = this.apiUrl + '/service/undok/reports/count-first-by-date-range';
    return this.http.get<number>(url, {params: {from: fromIso, to: toIso}});
  }

  countLanguagesByDateRange(fromIso: string, toIso: string): Observable<LanguageResult[]> {
    const url = this.apiUrl + '/service/undok/reports/count-languages-by-date-range';
    return this.http.get<LanguageResult[]>(url, {params: {from: fromIso, to: toIso}});
  }

  countNationalitiesByDateRange(fromIso: string, toIso: string): Observable<NationalityCount[]> {
    const url = this.apiUrl + '/service/undok/reports/nationality-counts';
    return this.http.get<NationalityCount[]>(url, {params: {from: fromIso, to: toIso}});
  }

  countNumberOfCounselingsByDateRange(fromIso: string, toIso: string): Observable<number> {
    const url = this.apiUrl + '/service/undok/reports/count-by-date-range';
    return this.http.get<number>(url, {params: {from: fromIso, to: toIso}});
  }

}
