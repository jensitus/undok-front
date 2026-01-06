import {Component, computed, DestroyRef, effect, inject, signal} from '@angular/core';
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
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';

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
export class SearchComponent {
  // Services
  private http = inject(HttpClient);
  private dateTimeService = inject(DateTimeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private calendar = inject(NgbCalendar);
  private destroyRef = inject(DestroyRef);

  // Constants
  readonly apiUrl = environment.api_url;
  readonly today = this.calendar.getToday();
  readonly initialFromDate: NgbDateStruct = {year: 2000, month: 1, day: 1};

  // Icons
  protected readonly faCalendarAlt = faCalendarAlt;
  protected readonly faCircleLeft = faCircleLeft;
  protected readonly faTasks = faTasks;

  // Signals for reactive state
  searchTerm                  = signal('');
  startDate            = signal<NgbDateStruct | null>(null);
  endDate              = signal<NgbDateStruct | null>(null);
  searchResults  = signal<UnifiedSearchResponse | null>(null);
  isLoading                 = signal(false);
  error                       = signal<string | null>(null);
  currentPage                = signal(0);
  pageSize                   = signal(4);

  // Query params as signal
  private queryParams = toSignal(this.route.queryParams, {initialValue: {}});
  private hasInitialized = signal(false);

  // Computed values
  hasResults      = computed(() => this.searchResults() !== null);
  totalPages      = computed(() => this.searchResults()?.pagination.totalPages ?? 0);
  hasNextPage     = computed(() => this.searchResults()?.pagination.hasNext ?? false);
  hasPreviousPage = computed(() => this.searchResults()?.pagination.hasPrevious ?? false);

  // Computed page numbers for pagination
  pageNumbers = computed(() => {
    const results = this.searchResults();
    if (!results) { return []; }

    const totalPages = results.pagination.totalPages;
    const current = this.currentPage();
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
  });

  // Subject for debounced search
  private searchSubject = new Subject<string>();

  constructor() {
    // Effect to load initial state from URL (only once)
    effect(() => {
      const params = this.queryParams();

      // Only run once on initialization
      if (this.hasInitialized()) {
        return;
      }

      if (params['q']) {
        this.searchTerm.set(params['q'] || '');
      }

      const page = parseInt(params['page'] || '0', 10);
      const size = parseInt(params['size'] || '4', 10);

      this.currentPage.set(page);
      this.pageSize.set(size);

      // Perform search if there's a search term
      if (this.searchTerm().trim().length > 0) {
        this.performSearchAndUpdateResults();
      }

      this.hasInitialized.set(true);
    }, {allowSignalWrites: true});

    // Setup debounced search with reasonable debounce time
    this.searchSubject.pipe(
      debounceTime(1500), // Changed from 1800ms to 500ms
      switchMap(term => {
        this.isLoading.set(true);
        this.updateUrl();
        return this.performSearch(term, 0);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Search failed. Please try again.');
        this.isLoading.set(false);
        console.error('Search error:', err);
      }
    });
  }

  onSearchInput(term: string) {
    this.searchTerm.set(term);

    if (term.trim().length === 0) {
      this.searchResults.set(null);
      this.currentPage.set(0);
      this.isLoading.set(false);
      return;
    }

    this.error.set(null);
    this.currentPage.set(0);
    // this.isLoading.set(true); // Set loading immediately for better UX
    this.searchSubject.next(term);
  }

  onSearchSubmit() {
    const term = this.searchTerm();

    if (term.trim().length === 0) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.currentPage.set(0);
    this.updateUrl();

    this.performSearch(term, 0)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (results) => {
            this.searchResults.set(results);
            this.isLoading.set(false);
          },
          error: (err) => {
            this.error.set('Search failed. Please try again.');
            this.isLoading.set(false);
            console.error('Search error:', err);
          }
        });
  }

  goToPage(page: number) {
    const results = this.searchResults();

    if (page < 0 || !results || page >= results.pagination.totalPages) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.currentPage.set(page);
    this.updateUrl();

    this.performSearch(this.searchTerm(), page)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (unifiedSearchResult) => {
            this.searchResults.set(unifiedSearchResult);
            this.isLoading.set(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },
          error: (err) => {
            this.error.set('Search failed. Please try again.');
            this.isLoading.set(false);
            console.error('Search error:', err);
          }
        });
  }

  nextPage() {
    if (this.hasNextPage()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  previousPage() {
    if (this.hasPreviousPage()) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  clearSearch() {
    this.searchTerm.set('');
    this.startDate.set(null);
    this.endDate.set(null);
    this.searchResults.set(null);
    this.currentPage.set(0);
    this.error.set(null);
    this.router.navigate(['/clients/search']);
    this.isLoading.set(false);
  }

  onDateChange() {
    // Trigger search when dates change (if there's already a search term)
    if (this.searchTerm().trim().length > 0) {
      this.onSearchSubmit();
    }
  }

  dateRangeChange(event: DateRange) {
    this.startDate.set(event.fromDate);
    this.endDate.set(event.toDate);
  }

  private performSearchAndUpdateResults() {
    this.isLoading.set(true);
    this.error.set(null);

    this.performSearch(this.searchTerm(), this.currentPage())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (results) => {
            this.searchResults.set(results);
            this.isLoading.set(false);
          },
          error: (err) => {
            this.error.set('Search failed. Please try again.');
            this.isLoading.set(false);
            console.error('Search error:', err);
          }
        });
  }

  private performSearch(term: string, page: number) {
    let params = new HttpParams()
      .set('q', term)
      .set('page', page.toString())
      .set('size', this.pageSize().toString());

    // Add date parameters if provided
    const start = this.startDate();
    const end = this.endDate();

    if (start) {
      params = params.set('startDate', this.dateTimeService.mergeDateAndTime(start, {hour: 0, minute: 0} as Time));
    }
    if (end) {
      params = params.set('endDate', this.dateTimeService.mergeDateAndTime(end, {hour: 23, minute: 59} as Time));
    }

    return this.http.get<UnifiedSearchResponse>(this.apiUrl + '/service/undok/search', { params });
  }

  private updateUrl() {
    const queryParams: any = {
      q: this.searchTerm(),
      page: this.currentPage(),
      size: this.pageSize()
    };

    const start = this.startDate();
    const end = this.endDate();

    if (start) {
      queryParams.start = this.dateTimeService.mergeDateAndTime(start, {hour: 0, minute: 0} as Time);
    }
    if (end) {
      queryParams.end = this.dateTimeService.mergeDateAndTime(end, {hour: 0, minute: 0} as Time);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
