import {DecimalPipe} from '@angular/common';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

/**
 * Baseline providers for component specs.
 *
 * Most components in this app reach for the router, HttpClient or the DecimalPipe somewhere in
 * their injector chain, so a bare `TestBed.configureTestingModule({imports: [TheComponent]})`
 * fails before the test body even runs. provideHttpClientTesting() also keeps specs from firing
 * real requests at localhost:8080 — those come back as errors after the spec has finished and
 * can take the whole Karma run down with them.
 *
 * Pass extra providers to override any of these per spec.
 */
export function defaultTestProviders(): any[] {
  return [
    provideRouter([]),
    provideHttpClient(),
    provideHttpClientTesting(),
    provideNoopAnimations(),
    DecimalPipe,
    {provide: NgbActiveModal, useValue: new NgbActiveModal()},
  ];
}
