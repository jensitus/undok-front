import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {debounceTime, Subject, switchMap} from 'rxjs';
import {DatePickerComponent, DateRange} from '../../common/date-picker/date-picker.component';
import {DateTimeService} from '../service/date-time.service';
import {NgbCalendar, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Time} from '../model/time';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {faCalendarAlt, faCircleLeft, faTasks} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {HighlightPipe} from './highlight.pipe';
import {TruncateAroundPipe} from './truncate-around.pipe';

interface CounselingSearchResult {
  id: number;
  concern: string;
  activity: string;
  type: string;
  clientId: string;
}

interface ClientSearchResult {
  id: number;
  keyword: string;
  lastName: string;
  firstName: string;
  comment: string;
  type: string;
}

interface TaskSearchResult {
  id: number;
  title: string;
  description: string;
  status: string;
  clientId: string;
  type: string;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCounselings: number;
  totalClients: number;
  totalTasks: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface UnifiedSearchResponse {
  counselings: CounselingSearchResult[];
  clients: ClientSearchResult[];
  tasks: TaskSearchResult[];
  totalResults: number;
  pagination: PaginationInfo;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerComponent, RouterLink, FaIconComponent, HighlightPipe, TruncateAroundPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  apiUrl = environment.api_url;
  protected today = inject(NgbCalendar).getToday();
  protected initialFromDate = inject(NgbCalendar).getNext(this.today, 'm', -12);
  private http = inject(HttpClient);
  private dateTimeService = inject(DateTimeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchTerm = '';
  startDate: NgbDateStruct | null = null;
  endDate: NgbDateStruct | null = null;
  searchResults: UnifiedSearchResponse | null = null;
  isLoading = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 4;
  start: string | null = null;
  end: string | null = null;

  private searchSubject = new Subject<string>();

  protected readonly faCalendarAlt = faCalendarAlt;
  protected readonly faCircleLeft = faCircleLeft;

  protected readonly faTasks = faTasks;

  ngOnInit() {
    // Load initial state from URL parameters
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.start = params['start'] || '';
      this.end = params['end'] || '';
      // tslint:disable-next-line:radix
      this.currentPage = parseInt(params['page'] || '0');
      // tslint:disable-next-line:radix
      this.pageSize = parseInt(params['size'] || '4');

      // Perform search if there's a search term in URL
      if (this.searchTerm.trim().length > 0) {
        this.performSearchAndUpdateResults();
      }
      if (this.start !== '') {
        this.initialFromDate = this.dateTimeService.convertToNgbDate(this.start);
      }
    });

    // Setup debounced search - waits 800ms after user stops typing
    this.searchSubject.pipe(
      debounceTime(800),
      switchMap(term => {
        this.isLoading = true;
        this.updateUrl();
        return this.performSearch(term, 0);
      })
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Search failed. Please try again.';
        this.isLoading = false;
        console.error('Search error:', err);
      }
    });
  }

  onSearchInput() {
    if (this.searchTerm.trim().length === 0) {
      this.searchResults = null;
      this.currentPage = 0;
      this.isLoading = false;
      return;
    }

    this.error = null;
    this.currentPage = 0;
    this.searchSubject.next(this.searchTerm);
  }

  onSearchSubmit() {
    if (this.searchTerm.trim().length === 0) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.currentPage = 0;
    this.updateUrl();

    this.performSearch(this.searchTerm, 0).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Search failed. Please try again.';
        this.isLoading = false;
        console.error('Search error:', err);
      }
    });
  }

  goToPage(page: number) {
    if (page < 0 || !this.searchResults || page >= this.searchResults.pagination.totalPages) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.currentPage = page;
    this.updateUrl();

    this.performSearch(this.searchTerm, page).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.error = 'Search failed. Please try again.';
        this.isLoading = false;
        console.error('Search error:', err);
      }
    });
  }

  nextPage() {
    if (this.searchResults?.pagination.hasNext) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.searchResults?.pagination.hasPrevious) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    if (!this.searchResults) { return []; }

    const totalPages = this.searchResults.pagination.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];

    // Show max 5 page numbers
    let start = Math.max(0, current - 2);
    const end = Math.min(totalPages, start + 5);

    // Adjust start if we're near the end
    if (end - start < 5) {
      start = Math.max(0, end - 5);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    return pages;
  }

  clearSearch() {
    this.searchTerm = '';
    this.startDate = null;
    this.endDate = null;
    this.searchResults = null;
    this.currentPage = 0;
    this.error = null;
    this.router.navigate(['/clients/search']);
    this.isLoading = false;
  }

  onDateChange() {
    // Trigger search when dates change (if there's already a search term)
    if (this.searchTerm.trim().length > 0) {
      this.onSearchSubmit();
    }
  }

  private performSearchAndUpdateResults() {
    this.isLoading = true;
    this.error = null;

    this.performSearch(this.searchTerm, this.currentPage).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Search failed. Please try again.';
        this.isLoading = false;
        console.error('Search error:', err);
      }
    });
  }

  private performSearch(term: string, page: number) {
    let params = new HttpParams()
      .set('q', term)
      .set('page', page.toString())
      .set('size', this.pageSize.toString());

    // Add date parameters if provided
    if (this.startDate) {
      params = params.set('startDate', this.dateTimeService.mergeDateAndTime(this.startDate, {hour: 0, minute: 0} as Time));
    }
    if (this.endDate) {
      params = params.set('endDate', this.dateTimeService.mergeDateAndTime(this.endDate, {hour: 23, minute: 59} as Time));
    }

    return this.http.get<UnifiedSearchResponse>(this.apiUrl + '/service/undok/search', { params });
  }


  dateRangeChange(event: DateRange) {
    this.startDate = event.fromDate;
    this.endDate = event.toDate;
  }

  private updateUrl() {
    const queryParams: any = {
      q: this.searchTerm,
      page: this.currentPage,
      size: this.pageSize
    };

    if (this.startDate) {
      queryParams.start = this.dateTimeService.mergeDateAndTime(this.startDate, {hour: 0, minute: 0} as Time);
    }
    if (this.endDate) {
      queryParams.end = this.dateTimeService.mergeDateAndTime(this.endDate, {hour: 0, minute: 0} as Time);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
