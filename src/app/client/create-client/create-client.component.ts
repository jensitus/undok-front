import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientForm} from '../model/clientForm';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {MARITAL_STATUS} from '../model/marital-status';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {NgbFormatterService} from '../../common/services/ngb-formatter.service';
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {ResidentStatus} from '../model/resident-status.enum';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {COUNTRIES_AT} from '../model/countriesAT';
import {CITIZENSHIPS} from '../model/citizenships';
import {CategoryTypes} from '../model/category-types';

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
  contactData: string;
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
  country: string;
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


  constructor(
    private clientService: ClientService,
    private ngbFormatterService: NgbFormatterService,
    private dateAdapter: NgbDateAdapter<string>,
    private commonService: CommonService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    // this.dateOfBirth = 'yyyy-mm-dd';
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this.unsubscribe$.next();
  }

  private formTheDate(date: NgbDateStruct): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
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
      // formerResidentStatus: this.formerResidentStatus,
      labourMarketAccess: this.labourMarketAccess,
      position: this.position,
      sector: this.sector,
      union: this.union,
      membership: this.membership,
      organization: this.organization
    };
    this.clientService.createClient(this.clientForm).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      this.router.navigate(['/clients/', result.id]);
      this.loading = false;
    }, error => {
      this.alertService.error(error.error);
    });
  }

  onDateChange(dateForm): void {
    // this.ngbFormatterService.format();
  }


  onMaritalChange(marital): void {
    this.m = marital;
    console.log(this.m);
  }

  onResidentStatusChange(status): void {
    let resStatus: string;
    switch (status) {
      case 'asyl':
        resStatus = ResidentStatus.ASYL;
        break;
      case 'eu':
        resStatus = ResidentStatus.EU;
        break;
      case 'illegal':
        resStatus = ResidentStatus.ILLEGAL;
        break;
      default:
        resStatus = ResidentStatus.UNKNOWN;
    }
    this.currentResidentStatus = resStatus;
    console.log(this.currentResidentStatus);
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
    console.log('country', country);
    switch (country) {
      case 'Countries':
        this.nationality = 'Unknown';
        break;
      default:
        this.nationality = country;
    }
  }

  showCat(event: any) {
    this.gender = event;
    console.log(this.gender);
  }

  selectResidentStatus(event: any) {
    this.currentResidentStatus = event;
  }

  selectSector(event: any) {
    this.sector = event;
  }
}
