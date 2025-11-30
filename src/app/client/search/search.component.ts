import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import {Counseling} from '../model/counseling';
import {SearchService} from '../service/search.service';
import {Page} from '../model/page';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  searchQuery = '';
  counselings: Counseling[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isLoading = false;
  errorMessage = '';

  private searchSubject = new Subject<string>();
  private searchService = inject(SearchService);

  ngOnInit(): void {
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
        return this.searchService.search(query, this.currentPage, this.pageSize);
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
    if (this.searchQuery.trim() === '') {
      this.counselings = [];
      this.totalElements = 0;
      this.totalPages = 0;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.searchService.search(this.searchQuery, this.currentPage, this.pageSize).subscribe({
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
    this.counselings = [];
    this.totalElements = 0;
    this.totalPages = 0;
    this.currentPage = 0;
  }

}
