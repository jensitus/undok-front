import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientForm} from '../model/clientForm';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {MARITAL_STATUS} from '../model/marital-status';
import {faBars, faTachometerAlt, faUsers} from '@fortawesome/free-solid-svg-icons';
import {NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ResidentStatus} from '../model/resident-status.enum';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {CITIZENSHIPS} from '../model/citizenships';
import {CategoryTypes} from '../model/category-types';
import {Label} from '../model/label';
import {AUSTRIA} from '../defaults/defaults';
import {DropdownItem} from '../model/dropdown-item';
import {EntityTypes} from '../model/entity-types';
import {JoinCategory} from '../model/join-category';
import {Client} from '../model/client';
import {takeUntil} from 'rxjs/operators';
import {AlertComponent} from '../../admin-template/layout/components/alert/alert.component';
import {PageHeaderComponent} from '../../admin-template/shared/modules/page-header/page-header.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-client',
  standalone: true,
  templateUrl: './create-client.component.html',
  imports: [
    AlertComponent,
    PageHeaderComponent,
    FormsModule
  ],
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent implements OnInit, OnDestroy {

  client: Client | undefined;

  clientForm: ClientForm;
  private unsubscribe$ = new Subject();
  readonly DELIMITER = '-';
  enumKeys = [];
  loading = false;


  // Person:
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  telephone: string;
  gender: string;

  // client:
  maritalStatus: string;
  m: string;

  faBars = faBars;
  howHasThePersonHeardFromUs: string;
  interpreterNecessary: boolean;
  vulnerableWhenAssertingRights: boolean;
  keyword: string;
  education: string;


  // Address:
  street: string;
  zipCode: string;
  city: string;
  country = AUSTRIA;

  nationality: string;
  language: string;
  currentResidentStatus: string;
  formerResidentStatus: string;
  labourMarketAccess: string;
  position: string;
  sector: string;
  union: string;
  membership: boolean;
  organization: string;

  protected readonly Label = Label;
  protected readonly faUsers = faUsers;
  protected readonly faTachometerAlt = faTachometerAlt;

  constructor(
    private clientService: ClientService,
    private dateAdapter: NgbDateAdapter<string>,
    private router: Router,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this.unsubscribe$.next();
  }

  submitClientForm() {
    this.clientService.createClient({keyword: this.keyword}).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (result) => {
        this.router.navigate(['/clients/' + result.id + '/edit']);
        this.loading = false;
      }, error: (error) => {
        this.alertService.error(error.error.text);
      }
    });
  }
}
