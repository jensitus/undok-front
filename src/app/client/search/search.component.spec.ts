import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { SearchComponent } from './search.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchComponent, HttpClientTestingModule, FormsModule]
    });

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should debounce search input', fakeAsync(() => {
    component.searchTerm = 'test';
    component.onSearchInput();

    // No request yet
    httpMock.expectNone('/api/search');

    tick(800);

    // Now request should be made
    const req = httpMock.expectOne((req) => req.url === '/api/search');
    expect(req.request.method).toBe('GET');
    req.flush({ counselings: [], clients: [], totalResults: 0, pagination: {} });
  }));

  it('should include date parameters in request', () => {
    component.searchTerm = 'test';
    component.startDate = { day: 1, month: 1, year: 2024 };
    component.endDate = { day: 31, month: 12, year: 2024 };

    component.onSearchSubmit();

    const req = httpMock.expectOne((req) =>
      req.url === '/api/search' &&
      req.params.get('startDate') === '2024-01-01' &&
      req.params.get('endDate') === '2024-12-31'
    );

    expect(req.request.method).toBe('GET');
    req.flush({ counselings: [], clients: [], totalResults: 0, pagination: {} });
  });

  it('should clear all fields on clearSearch', () => {
    component.searchTerm = 'test';
    component.startDate = { day: 12, month: 1, year: 2024 };
    component.endDate = { day: 31, month: 12, year: 2024 };

    component.clearSearch();

    expect(component.searchTerm).toBe('');
    expect(component.startDate).toBe('');
    expect(component.endDate).toBe('');
    expect(component.searchResults).toBeNull();
  });
});
