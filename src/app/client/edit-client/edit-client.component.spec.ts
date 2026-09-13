import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, of} from 'rxjs';

import {EditClientComponent} from './edit-client.component';
import {ClientService} from '../service/client.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {Client} from '../model/client';
import {AlertComponent} from '../../admin-template/layout/components/alert/alert.component';
import {PageHeaderComponent} from '../../admin-template/shared/page-header/page-header.component';
import {ClientFormComponent} from '../client-form/client-form.component';

describe('EditClientComponent', () => {
  let fixture: ComponentFixture<EditClientComponent>;
  let component: EditClientComponent;
  let client$: Subject<Client>;
  let router: jasmine.SpyObj<Router>;

  const CLIENT = {
    id: 'client-1',
    keyword: 'ABC',
    firstName: 'Ada',
    lastName: 'Lovelace',
  } as Client;

  beforeEach(async () => {
    client$ = new Subject<Client>();
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EditClientComponent],
      providers: [
        {provide: ClientService, useValue: {getSingleClient: () => client$, updateClient: () => of({})}},
        {provide: ActivatedRoute, useValue: {params: of({id: 'client-1'})}},
        {provide: Router, useValue: router},
        {provide: AlertService, useValue: jasmine.createSpyObj('AlertService', ['success', 'error'])},
      ]
    })
      // the children pull in the whole category/http stack; this spec is about the page's own template
      .overrideComponent(EditClientComponent, {
        remove: {imports: [AlertComponent, PageHeaderComponent, ClientFormComponent]},
        add: {schemas: [NO_ERRORS_SCHEMA]}
      })
      .compileComponents();

    fixture = TestBed.createComponent(EditClientComponent);
    component = fixture.componentInstance;
  });

  const query = (selector: string) => fixture.nativeElement.querySelector(selector);

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders the loading state without dereferencing the not-yet-loaded client', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(query('.spinner-border')).withContext('spinner while loading').toBeTruthy();
    expect(query('app-client-form')).withContext('no form yet').toBeNull();
    // the breadcrumb link comes from the route param, not from the client
    expect(component.clientId()).toBe('client-1');
  });

  it('renders the form once the client has loaded', () => {
    fixture.detectChanges();
    client$.next(CLIENT);
    fixture.detectChanges();

    expect(query('.spinner-border')).withContext('spinner gone').toBeNull();
    expect(query('app-client-form')).withContext('form rendered').toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Ada');
  });

  it('renders an error instead of a blank page when the client cannot be loaded', () => {
    fixture.detectChanges();
    client$.error(new Error('boom'));
    fixture.detectChanges();

    expect(query('.alert-danger')).withContext('error shown').toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('boom');
    expect(query('app-client-form')).toBeNull();
  });
});
