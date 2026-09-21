import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

import {ShowClientsComponent} from './show-clients.component';

import {defaultTestProviders} from '../../../testing/test-providers';
import {AllClient} from '../model/all-client';
import {environment} from '../../../environments/environment';

describe('ShowClientsComponent', () => {
  let component: ShowClientsComponent;
  let fixture: ComponentFixture<ShowClientsComponent>;
  let httpMock: HttpTestingController;

  const client = (id: string, overrides: Partial<AllClient> = {}): AllClient => ({
    id,
    keyword: 'kw-' + id,
    firstName: 'First' + id,
    lastName: 'Last' + id,
    nationality: 'AT',
    ...overrides
  } as AllClient);

  function flushClients(clients: AllClient[]): void {
    httpMock.expectOne(environment.api_url + '/service/undok/clients/all').flush(clients);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowClientsComponent],
      providers: [...defaultTestProviders(), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowClientsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    flushClients([]);
    expect(component).toBeTruthy();
  });

  it('puts open cases in the top section and closed ones below', () => {
    flushClients([
      client('1', {caseStatus: 'OPEN'}),
      client('2', {caseStatus: 'CLOSED', caseEndDate: '2026-03-04', referredTo: 'AK Wien'}),
      client('3', {caseStatus: 'OPEN'})
    ]);

    expect(component.openClients().map(c => c.id)).toEqual(['1', '3']);
    expect(component.closedClients().map(c => c.id)).toEqual(['2']);
  });

  it('groups a client with no case at all with the open ones, not the closed ones', () => {
    flushClients([
      client('1', {caseStatus: undefined}),
      client('2', {caseStatus: 'CLOSED'})
    ]);

    expect(component.openClients().map(c => c.id)).toEqual(['1']);
    expect(component.closedClients().map(c => c.id)).toEqual(['2']);
  });

  it('filters both sections from the one search box', () => {
    flushClients([
      client('1', {caseStatus: 'OPEN', firstName: 'Anna'}),
      client('2', {caseStatus: 'CLOSED', firstName: 'Anna'}),
      client('3', {caseStatus: 'OPEN', firstName: 'Bernd'})
    ]);

    component.onSearch('anna');

    expect(component.openClients().map(c => c.id)).toEqual(['1']);
    expect(component.closedClients().map(c => c.id)).toEqual(['2']);
  });

  it('does not rewrite null names on the client objects while filtering', () => {
    const withNulls = client('1', {caseStatus: 'OPEN', firstName: null, lastName: null});
    flushClients([withNulls]);

    component.onSearch('kw-1');

    expect(component.openClients().length).toBe(1);
    expect(withNulls.firstName).toBeNull();
  });

  it('pages each section independently', () => {
    const clients: AllClient[] = [];
    for (let i = 0; i < 25; i++) {
      clients.push(client('open-' + i, {caseStatus: 'OPEN'}));
    }
    for (let i = 0; i < 25; i++) {
      clients.push(client('closed-' + i, {caseStatus: 'CLOSED'}));
    }
    flushClients(clients);

    expect(component.openPageItems().length).toBe(20);
    expect(component.closedPageItems().length).toBe(20);

    component.openPage.set(2);

    expect(component.openPageItems().length).toBe(5);
    // the closed section must not have moved with it
    expect(component.closedPage()).toBe(1);
    expect(component.closedPageItems().length).toBe(20);
  });

  it('resets both pages when the filter changes', () => {
    const clients: AllClient[] = [];
    for (let i = 0; i < 25; i++) {
      clients.push(client('open-' + i, {caseStatus: 'OPEN'}));
    }
    flushClients(clients);
    component.openPage.set(2);

    component.onSearch('kw-open-1');

    expect(component.openPage()).toBe(1);
    expect(component.closedPage()).toBe(1);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
