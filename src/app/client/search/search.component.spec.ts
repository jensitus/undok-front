import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { SearchComponent } from './search.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchComponent, HttpClientTestingModule, FormsModule],
      providers: [...defaultTestProviders()]
    });

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const isSearchRequest = (req: {url: string}) => req.url.includes('/service/undok/search');

  it('should debounce search input', fakeAsync(() => {
    component.onSearchInput('test');

    // nothing goes out before the 1500ms debounce has elapsed
    httpMock.expectNone(isSearchRequest);
    tick(1400);
    httpMock.expectNone(isSearchRequest);

    tick(200);

    const req = httpMock.expectOne(isSearchRequest);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('q')).toBe('test');
    req.flush({ counselings: [], clients: [], tasks: [], totalResults: 0, pagination: {} });
  }));

  it('should include date parameters in request', () => {
    component.searchTerm.set('test');
    component.startDate.set({ day: 1, month: 1, year: 2024 });
    component.endDate.set({ day: 31, month: 12, year: 2024 });

    component.onSearchSubmit();

    const req = httpMock.expectOne((req) =>
      req.url.includes('/service/undok/search')
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('startDate')).toBeTruthy();
    expect(req.request.params.has('endDate')).toBeTruthy();
    req.flush({ counselings: [], clients: [], tasks: [], totalResults: 0, pagination: {} });
  });

  it('should clear all fields on clearSearch', () => {
    component.searchTerm.set('test');
    component.startDate.set({ day: 12, month: 1, year: 2024 });
    component.endDate.set({ day: 31, month: 12, year: 2024 });

    component.clearSearch();

    expect(component.searchTerm()).toBe('');
    expect(component.startDate()).toBeNull();
    expect(component.endDate()).toBeNull();
    expect(component.searchResults()).toBeNull();
  });
});
