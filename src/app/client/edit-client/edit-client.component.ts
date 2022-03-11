import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ClientForm} from '../model/clientForm';
import {Subject, Subscription} from 'rxjs';
import {MaritalStatus} from '../model/marital-status.enum';
import {Country} from '../model/country.enum';
import {ClientService} from '../service/client.service';
import {NgbFormatterService} from '../../common/services/ngb-formatter.service';
import {NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';
import {Router} from '@angular/router';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {Client} from '../model/client';
import {Person} from '../model/person';
import {takeUntil} from 'rxjs/operators';
import {ResidentStatus} from '../model/resident-status.enum';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit, OnDestroy {

  @Input() client: Client;

  clientForm: ClientForm;
  private unsubscribe$: Subscription[] = [];
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  maStatus = Object.values(MaritalStatus);
  maritalStatus: MaritalStatus;
  m: MaritalStatus;
  marital: string;
  faBars = faBars;
  howHasThePersonHeardFromUs: string;
  interpreterNecessary: boolean;
  vulnerableWhenAssertingRights: boolean;
  keyword: string;
  education: string;
  readonly DELIMITER = '-';
  enumKeys = [];
  street: string;
  zipCode: string;
  city: string;
  country: string;
  countries = Object.keys(Country);
  residentStatusLOV = Object.values(ResidentStatus);
  currentResidentStatus: string;

  loading = false;

  constructor(
    private clientService: ClientService,
    private ngbFormatterService: NgbFormatterService,
    private dateAdapter: NgbDateAdapter<string>,
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  onCountryChange(country) {
    console.log(country);
    switch (country) {
      case 'Countries':
        this.client.person.address.country = 'Unknown';
        break;
      default:
        this.client.person.address.country = country;
    }
  }

  onMaritalChange(donner): void {
    switch (donner) {
      case 'unknown':
        this.client.maritalStatus = MaritalStatus.UNKNOWN;
        break;
      case 'Ledig':
        this.client.maritalStatus = MaritalStatus.SINGLE;
        break;
      case 'Verheiratet':
        this.client.maritalStatus = MaritalStatus.MARRIED;
        break;
      case 'Geschieden':
        this.client.maritalStatus = MaritalStatus.DIVORCED;
        break;
      case 'Verwitwet':
        this.client.maritalStatus = MaritalStatus.WIDOWED;
        break;
      case 'Eingetragene Partnerschaft':
        this.client.maritalStatus = MaritalStatus.REGISTERED_PARTNERSHIP;
        break;
      case 'Aufgelöste eingetragene Partnerschaft':
        this.client.maritalStatus = MaritalStatus.DISSOLVED_REGISTERED_PARTNERSHIP;
        break;
      case 'Hinterbliebener eingetragene Partnerschaft':
        this.client.maritalStatus = MaritalStatus.SURVIVING_REGISTERED_PARTNERSHIP;
        break;
      default:
        this.client.maritalStatus = MaritalStatus.UNKNOWN;
    }
    console.log(this.m);
  }

  submit(): void {
    const theRealDate = this.dateAdapter.fromModel(this.dateOfBirth);
    console.log('the real date', theRealDate);
    const dateOfBirth = this.ngbFormatterService.format(theRealDate);
    console.log('date of birth', dateOfBirth);
    this.client.person.dateOfBirth = dateOfBirth;
    console.log('this.client', this.client);
    // this.clientForm = {
    //   firstName: this.firstName,
    //   lastName: this.lastName,
    //   maritalStatus: this.m,
    //   dateOfBirth: this.ngbFormatterService.format(theRealDate),
    //   howHasThePersonHeardFromUs: this.howHasThePersonHeardFromUs,
    //   interpreterNecessary: this.interpreterNecessary,
    //   vulnerableWhenAssertingRights: this.vulnerableWhenAssertingRights,
    //   keyword: this.keyword,
    //   education: this.education,
    //   street: this.street,
    //   zipCode: this.zipCode,
    //   city: this.city,
    //   country: this.country
    // };
    this.unsubscribe$.push(this.clientService.updateClient(this.client.id, this.client).subscribe(result => {
      this.loading = true;
      this.commonService.setDemoSubject(true);
      this.loading = false;
    }));
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
    this.client.currentResidentStatus = resStatus;
  }

}
