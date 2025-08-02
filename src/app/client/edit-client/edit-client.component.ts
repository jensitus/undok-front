import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
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

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit, OnDestroy {
  private joinCategories: JoinCategory[] = [];
  private joinCategory: JoinCategory;
  deSelectedItems: DropdownItem[] = [];
  jobMarketAccessSelected: Category[];

  constructor(
    private clientService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
  ) {
  }

  client: Client | undefined;
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

  loading = false;

  protected readonly Label = Label;

  ngOnInit(): void {
    this.unsubscribe$.push(
      this.activatedRoute.params.subscribe({
        next: (params) => {
          this.client_id = params['id'];
          this.unsubscribe$.push(
            this.clientService.getSingleClient(this.client_id).subscribe({
              next: (client) => {
                this.client = client;
                this.country = this.client.person.address.country;
                this.nationality = this.client.nationality;
                this.marital = this.client.maritalStatus;
              }
            })
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  submit(): void {

  }

  showSubmitted(event: ClientForm) {
    this.unsubscribe$.push(
      this.clientService.updateClient(this.client.id, event).subscribe({
        next: (response) => {
          this.loading = true;
          this.loading = false;
          this.alertService.success(response.text, true);
          this.router.navigate(['clients/', this.client_id]);
        }
      })
    );
  }

  showCategoryValue(event: DropdownItem[], jobMarketAccessType: CategoryTypes) {
    this.joinCategories = [];
    event.forEach(e => {
      this.joinCategory = {
        categoryId: e.itemId,
        categoryType: jobMarketAccessType,
        entityId: this.client.id,
        entityType: EntityTypes.CLIENT
      };
      this.joinCategories.push(this.joinCategory);
    });
    console.log('this.joinCategories', this.joinCategories);
  }

  showDeSelected(event: DropdownItem[]) {
    this.deSelectedItems = event;
    console.log('this.deSelectedItems', this.deSelectedItems);
  }
}
