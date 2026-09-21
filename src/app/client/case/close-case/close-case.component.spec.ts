import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

import {CloseCaseComponent} from './close-case.component';

import {defaultTestProviders} from '../../../../testing/test-providers';
import {AlertService} from '../../../admin-template/layout/components/alert/services/alert.service';

import {Case} from '../../model/case';
import {environment} from '../../../../environments/environment';

describe('CloseCaseComponent', () => {
  let component: CloseCaseComponent;
  let fixture: ComponentFixture<CloseCaseComponent>;
  let httpMock: HttpTestingController;

  const openCase = {
    id: 'case-1', name: 'case-01', status: 'OPEN', clientId: 'client-1', startDate: '2026-01-10'
  } as Case;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseCaseComponent],
      providers: [...defaultTestProviders(), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseCaseComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('caseToClose', openCase);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    // The embedded <app-select-box> loads its own categories; drain it so verify() only sees
    // the close request each spec is actually about.
    httpMock.match(req => req.url.includes('/categories/')).forEach(req => req.flush([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('PUTs the picked end date as ISO yyyy-MM-dd, not the dd/MM/yyyy display format', () => {
    component['endDate'].set({year: 2026, month: 3, day: 4});
    component['referredTo'].set('AK Wien');

    component.closeCase();

    const req = httpMock.expectOne(environment.api_url + '/service/undok/case/case-1/close');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({endDate: '2026-03-04', referredTo: 'AK Wien'});
    req.flush({});
  });

  it('emits true once the case is closed', () => {
    const emitted: boolean[] = [];
    component.caseClosed.subscribe(value => emitted.push(value));

    component.closeCase();
    httpMock.expectOne(environment.api_url + '/service/undok/case/case-1/close').flush({});

    expect(emitted).toEqual([true]);
    expect(component['saving']()).toBeFalse();
  });

  it('emits false and surfaces the backend message, which arrives under `text`', () => {
    const emitted: boolean[] = [];
    component.caseClosed.subscribe(value => emitted.push(value));
    const alertService = TestBed.inject(AlertService);
    const errorSpy = spyOn(alertService, 'error');

    component.closeCase();
    httpMock.expectOne(environment.api_url + '/service/undok/case/case-1/close')
            .flush({text: 'Dieser Fall ist bereits abgeschlossen.'},
                   {status: 409, statusText: 'Conflict'});

    expect(emitted).toEqual([false]);
    expect(component['saving']()).toBeFalse();
    // 409 is silent in the ErrorInterceptor, so this alert is the only feedback the user gets.
    expect(errorSpy).toHaveBeenCalledWith('Dieser Fall ist bereits abgeschlossen.');
  });

  it('does not fire a second request while one is in flight', () => {
    component.closeCase();
    component.closeCase();

    httpMock.expectOne(environment.api_url + '/service/undok/case/case-1/close').flush({});
    httpMock.verify();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
