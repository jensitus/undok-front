import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import {Counseling} from '../model/counseling';
import {SearchService} from '../service/search.service';
import {Page} from '../model/page';
import {RouterLink} from '@angular/router';
import {DatePickerComponent} from '../../common/date-picker/date-picker.component';
import {DateTimeService} from '../service/date-time.service';
import {NgbCalendar, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Time} from '../model/time';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePickerComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  searchQuery = '';
  counselings: Counseling[] = [];
  currentPage = 0;
  pageSize = 4;
  totalElements = 0;
  totalPages = 0;
  isLoading = false;
  errorMessage = '';

  // Date range filters
  dateFrom: NgbDateStruct;
  dateTo: NgbDateStruct;
  fromTime: Time = {hour: 0, minute: 0};
  toTime: Time = {hour: 23, minute: 59};
  showFilters = false;

  private searchSubject = new Subject<string>();
  private searchService = inject(SearchService);
  private dateTimeService = inject(DateTimeService);
  private today = inject(NgbCalendar).getToday();

  ngOnInit(): void {
    this.dateFrom = {year: 2000, month: 1, day: 1};
    this.dateTo = this.today;
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.trim() === '') {
          return of({ content: [], totalElements: 0, totalPages: 0 } as Page<Counseling>);
        }
        this.isLoading = true;
        this.errorMessage = '';
        console.log('Searching for:', query);
        console.log('From:', this.dateFrom);
        console.log('To:', this.dateTo);
        const fromIso = this.dateTimeService.mergeDateAndTime(this.dateFrom, this.fromTime);
        const toIso = this.dateTimeService.mergeDateAndTime(this.dateTo, this.toTime);
        return this.searchService.search(query, this.currentPage, this.pageSize, fromIso, toIso);
      })
    ).subscribe({
      next: (page) => {
        this.counselings = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.errorMessage = 'An error occurred while searching. Please try again.';
        this.isLoading = false;
        this.counselings = [];
      }
    });
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.searchSubject.next(this.searchQuery);
  }

  onSearch(): void {
    const fromIso = this.dateTimeService.mergeDateAndTime(this.dateFrom, this.fromTime);
    const toIso = this.dateTimeService.mergeDateAndTime(this.dateTo, this.toTime);
    if (this.searchQuery.trim() === '') {
      this.counselings = [];
      this.totalElements = 0;
      this.totalPages = 0;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.searchService.search(this.searchQuery,
      this.currentPage,
      this.pageSize,
      fromIso || undefined,
      toIso || undefined).subscribe({
      next: (page) => {
        this.counselings = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.errorMessage = 'An error occurred while searching. Please try again.';
        this.isLoading = false;
        this.counselings = [];
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.onSearch();
  }

  resetFilters(): void {
    this.dateFrom = undefined;
    this.dateTo = undefined;
    this.currentPage = 0;
    this.onSearch();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.onSearch();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.dateFrom = undefined;
    this.dateTo = undefined;
    this.counselings = [];
    this.totalElements = 0;
    this.totalPages = 0;
    this.currentPage = 0;
  }

  onDateRangeSelected(event: any) {

    console.log('event', event.fromDate);
    this.dateFrom = event.fromDate;
    console.log('event', event.toDate);
    this.dateTo = event.toDate;

  }

}
