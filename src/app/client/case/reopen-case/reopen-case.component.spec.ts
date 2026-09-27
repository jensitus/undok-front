import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

import {ReopenCaseComponent} from './reopen-case.component';

import {defaultTestProviders} from '../../../../testing/test-providers';
import {AlertService} from '../../../admin-template/layout/components/alert/services/alert.service';

import {Case} from '../../model/case';
import {environment} from '../../../../environments/environment';

describe('ReopenCaseComponent', () => {
  let component: ReopenCaseComponent;
  let fixture: ComponentFixture<ReopenCaseComponent>;
  let httpMock: HttpTestingController;

  /** As the backend delivers them: end date ascending, so 'case-2' closed most recently. */
  const closedCases = [
    {id: 'case-1', name: 'case-01', status: 'CLOSED', clientId: 'client-1',
      startDate: '2023-01-10', endDate: '2024-02-01'} as Case,
    {id: 'case-2', name: 'case-02', status: 'CLOSED', clientId: 'client-1',
      startDate: '2025-03-10', endDate: '2026-04-01'} as Case
  ];

  function createComponent(cases: Case[]): void {
    fixture = TestBed.createComponent(ReopenCaseComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('closedCases', cases);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReopenCaseComponent],
      providers: [...defaultTestProviders(), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();
  });

  it('should create', () => {
    createComponent(closedCases);
    expect(component).toBeTruthy();
  });

  it('preselects the most recently closed case, which the backend sends last', () => {
    createComponent(closedCases);

    component.reopenCase();

    const req = httpMock.expectOne(environment.api_url + '/service/undok/case/case-2/reopen');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('renders one radio per closed case, the most recent one checked', () => {
    createComponent(closedCases);

    const radios: NodeListOf<HTMLInputElement> =
      fixture.nativeElement.querySelectorAll('input[type="radio"]');

    expect(radios.length).toBe(2);
    // candidates() is newest first, and that first one is preselected
    expect(radios[0].checked).toBeTrue();
    expect(radios[1].checked).toBeFalse();
  });

  it('reopens the case whose radio was clicked', () => {
    createComponent(closedCases);

    const radios: NodeListOf<HTMLInputElement> =
      fixture.nativeElement.querySelectorAll('input[type="radio"]');
    radios[1].click();
    fixture.detectChanges();

    component.reopenCase();

    httpMock.expectOne(environment.api_url + '/service/undok/case/case-1/reopen').flush({});
  });

  it('renders no radio when there is only one closed case', () => {
    createComponent([closedCases[0]]);

    expect(fixture.nativeElement.querySelectorAll('input[type="radio"]').length).toBe(0);
  });

  it('reopens the case the counsellor picked instead', () => {
    createComponent(closedCases);
    component['selectedId'].set('case-1');

    component.reopenCase();

    httpMock.expectOne(environment.api_url + '/service/undok/case/case-1/reopen').flush({});
  });

  it('needs no pick when there is only one closed case', () => {
    createComponent([closedCases[0]]);

    component.reopenCase();

    httpMock.expectOne(environment.api_url + '/service/undok/case/case-1/reopen').flush({});
  });

  it('emits true once the case is reopened', () => {
    createComponent(closedCases);
    const emitted: boolean[] = [];
    component.caseReopened.subscribe(value => emitted.push(value));

    component.reopenCase();
    httpMock.expectOne(environment.api_url + '/service/undok/case/case-2/reopen').flush({});

    expect(emitted).toEqual([true]);
    expect(component['saving']()).toBeFalse();
  });

  it('emits false and surfaces the backend message, which arrives under `text`', () => {
    createComponent(closedCases);
    const emitted: boolean[] = [];
    component.caseReopened.subscribe(value => emitted.push(value));
    const errorSpy = spyOn(TestBed.inject(AlertService), 'error');

    component.reopenCase();
    httpMock.expectOne(environment.api_url + '/service/undok/case/case-2/reopen')
            .flush({text: 'Dieser Fall ist nicht abgeschlossen.'},
                   {status: 409, statusText: 'Conflict'});

    expect(emitted).toEqual([false]);
    expect(component['saving']()).toBeFalse();
    // 409 is silent in the ErrorInterceptor, so this alert is the only feedback the user gets.
    expect(errorSpy).toHaveBeenCalledWith('Dieser Fall ist nicht abgeschlossen.');
  });

  it('does not fire a second request while one is in flight', () => {
    createComponent(closedCases);

    component.reopenCase();
    component.reopenCase();

    httpMock.expectOne(environment.api_url + '/service/undok/case/case-2/reopen').flush({});
    httpMock.verify();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
