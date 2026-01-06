import {Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {of, startWith, Subscription} from 'rxjs';
import {ClientService} from '../service/client.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Client} from '../model/client';
import {MARITAL_STATUS} from '../model/marital-status';
import {CategoryTypes} from '../model/category-types';
import {faBars, faPencilAlt, faTachometerAlt, faUser, faUsers} from '@fortawesome/free-solid-svg-icons';
import {Label} from '../model/label';
import {ClientForm} from '../model/clientForm';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {DropdownItem} from '../model/dropdown-item';
import {EntityTypes} from '../model/entity-types';
import {JoinCategory} from '../model/join-category';
import {Category} from '../model/category';
import {AlertComponent} from '../../admin-template/layout/components/alert/alert.component';
import {PageHeaderComponent} from '../../admin-template/shared/modules/page-header/page-header.component';
import {ClientFormComponent} from '../client-form/client-form.component';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ResourceState} from '../model/resource-state.model';

@Component({
  selector: 'app-edit-client',
  standalone: true,
  templateUrl: './edit-client.component.html',
  imports: [
    AlertComponent,
    PageHeaderComponent,
    ClientFormComponent
  ],
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent {

  // old stuff:
  // client: Client | undefined;
  client_id: string;
  private unsubscribe$: Subscription[] = [];
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  maritalStatus = MARITAL_STATUS;
  marital: string;
  faBars = faBars;
  faTachometerAlt = faTachometerAlt;
  faPencil = faPencilAlt;
  protected readonly faUser = faUser;
  protected readonly faUsers = faUsers;
  howHasThePersonHeardFromUs: string;
  interpreterNecessary: boolean;
  vulnerableWhenAssertingRights: boolean;
  keyword: string;
  education: string;
  readonly DELIMITER = '-';
  street: string;
  zipCode: string;
  city: string;
  nationality: string;
  country: string;
  currentResidentStatus: string;

  loading = signal(false);

  protected readonly Label = Label;

  // old stuff end


  private joinCategories: JoinCategory[] = [];
  private joinCategory: JoinCategory;
  deSelectedItems: DropdownItem[] = [];
  jobMarketAccessSelected: Category[];

  // the new approach:

  private clientService = inject(ClientService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);

  clientId = toSignal(
    this.activatedRoute.params.pipe(map(params => params['id']))
  );

  private clientResource = toSignal(
    this.activatedRoute.params.pipe(
      switchMap(params =>
        this.clientService.getSingleClient(params['id']).pipe(
          map((client): ResourceState<Client> => ({
            state: 'success',
            data: client
          })),
          catchError((error): ResourceState<Client>[] => [{
            state: 'error',
            error: error.message || 'Failed to load client'
          }]),
          startWith({ state: 'loading' } as ResourceState<Client>)
        )
      )
    ),
    { initialValue: { state: 'loading' } as ResourceState<Client> }
  );

  client = computed(() => {
    const resource = this.clientResource();
    return resource.state === 'success' ? resource.data : null;
  });

  isLoading = computed(() => this.clientResource().state === 'loading');

  error = computed(() => {
    const resource = this.clientResource();
    return resource.state === 'error' ? resource.error : null;
  });

  hasData = computed(() => !!this.client());

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  retry(): void {
    const currentId = this.clientId();
    if (currentId) {
      this.router.navigate(['/clients', currentId], {
        queryParamsHandling: 'preserve'
      });
    }
  }

  constructor(
  ) {
  }

  showSubmitted(event: ClientForm) {
    const currentClient = this.client();
    const currentClientId = this.clientId();

    if (!currentClient || !currentClientId) {
      this.alertService.error('Client not found');
      return;
    }

    this.loading.set(true);

    this.clientService.updateClient(currentClient.id, event)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            this.alertService.success(response.text, true);
            this.router.navigate(['clients/', currentClientId]);
          },
          error: (err) => {
            this.loading.set(false);
            this.alertService.error('Failed to update client');
            console.error('Update error:', err);
          }
        });
  }

}
