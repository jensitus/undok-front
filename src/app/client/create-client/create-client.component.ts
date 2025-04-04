import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientForm} from '../model/clientForm';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {MARITAL_STATUS} from '../model/marital-status';
import {faBars, faTachometerAlt, faUsers} from '@fortawesome/free-solid-svg-icons';
import {NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {ResidentStatus} from '../model/resident-status.enum';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {COUNTRIES_AT} from '../model/countriesAT';
import {CITIZENSHIPS} from '../model/citizenships';
import {CategoryTypes} from '../model/category-types';
import {Label} from '../model/label';
import {AUSTRIA} from '../defaults/defaults';
import {DropdownItem} from '../model/dropdown-item';
import {EntityTypes} from '../model/entity-types';
import {JoinCategory} from '../model/join-category';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent implements OnInit, OnDestroy {

  clientForm: ClientForm;
  private unsubscribe$ = new Subject();
  readonly DELIMITER = '-';
  enumKeys = [];
  loading = false;
  cat_gender: CategoryTypes = CategoryTypes.CAT_GENDER;
  cat_aufenthaltstitel: CategoryTypes = CategoryTypes.AUFENTHALTSTITEL;
  cat_sector: CategoryTypes = CategoryTypes.SECTOR;

  // Person:
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  socialInsuranceNumber: string;
  email: string;
  telephone: string;
  gender: string;

  // client:
  maStatus = MARITAL_STATUS;
  maritalStatus: string;
  m: string;
  marital: string;

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
  countries = COUNTRIES_AT;
  citizenships = CITIZENSHIPS;

  nationality: string;
  language: string;
  residentStatusLOV = Object.values(ResidentStatus);
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
  jobFunctionType: CategoryTypes = CategoryTypes.JOB_FUNCTION;
  jobFunctionLabel: Label;
  joinCategories: JoinCategory[] = [];
  joinCategory: JoinCategory;


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

  submit(): void {
    console.log('input type date', this.dateOfBirth);
    this.loading = true;
    const theRealDate = this.dateAdapter.fromModel(this.dateOfBirth);
    this.clientForm = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      telephone: this.telephone,
      gender: this.gender,
      maritalStatus: this.m,
      dateOfBirth: this.dateOfBirth, // this.ngbFormatterService.format(theRealDate),
      howHasThePersonHeardFromUs: this.howHasThePersonHeardFromUs,
      interpreterNecessary: this.interpreterNecessary,
      vulnerableWhenAssertingRights: this.vulnerableWhenAssertingRights,
      keyword: this.keyword,
      education: this.education,
      street: this.street,
      zipCode: this.zipCode,
      city: this.city,
      country: this.country,
      nationality: this.nationality,
      language: this.language,
      currentResidentStatus: this.currentResidentStatus,
      labourMarketAccess: this.labourMarketAccess,
      position: this.position,
      sector: this.sector,
      union: this.union,
      membership: this.membership,
      organization: this.organization,
      socialInsuranceNumber: this.socialInsuranceNumber
    };
    this.clientService.createClient(this.clientForm).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (result) => {
        this.router.navigate(['/clients/', result.id]);
        this.loading = false;
      }, error: (error) => {
        this.alertService.error(error.error);
      }
    })
    ;
  }

  onMaritalChange(marital): void {
    this.m = marital;
  }

  onCountryChange(country) {
    switch (country) {
      case 'Countries':
        this.country = 'Unknown';
        break;
      default:
        this.country = country;
    }
  }

  onCitizenshipChange(country) {
    switch (country) {
      case 'Countries':
        this.nationality = 'Unknown';
        break;
      default:
        this.nationality = country;
    }
  }

  selectGender(event: any) {
    this.gender = event;
  }

  selectResidentStatus(event: any) {
    this.currentResidentStatus = event;
  }

  selectSector(event: any) {
    this.sector = event;
  }

  showCategoryValue(event: DropdownItem[], jobFunctionType: CategoryTypes) {
    this.joinCategories = [];
    event.forEach(e => {
      this.joinCategory = {
        categoryId: e.itemId,
        categoryType: jobFunctionType,
        entityId: undefined, // this.counseling.id,
        entityType: EntityTypes.COUNSELING
      };
      this.joinCategories.push(this.joinCategory);
    });
  }
}
