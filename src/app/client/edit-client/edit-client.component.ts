import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ClientForm} from '../model/clientForm';
import {Subject} from 'rxjs';
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

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit, OnDestroy {

  @Input() person: Person;

  clientForm: ClientForm;
  private unsubscribe$ = new Subject();
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

  private loading = false;

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
    this.unsubscribe$.next();
  }

  onCountryChange(country) {
    console.log(country);
    switch (country) {
      case 'Countries':
        this.person.address.country = 'Unknown';
        break;
      default:
        this.person.address.country = country;
    }
  }

  onMaritalChange(donner): void {
    switch (donner) {
      case 'unknown':
        this.person.client.maritalStatus = MaritalStatus.UNKNOWN;
        break;
      case 'Ledig':
        this.person.client.maritalStatus = MaritalStatus.SINGLE;
        break;
      case 'Verheiratet':
        this.person.client.maritalStatus = MaritalStatus.MARRIED;
        break;
      case 'Geschieden':
        this.person.client.maritalStatus = MaritalStatus.DIVORCED;
        break;
      case 'Verwitwet':
        this.person.client.maritalStatus = MaritalStatus.WIDOWED;
        break;
      case 'Eingetragene Partnerschaft':
        this.person.client.maritalStatus = MaritalStatus.REGISTERED_PARTNERSHIP;
        break;
      case 'Aufgelöste eingetragene Partnerschaft':
        this.person.client.maritalStatus = MaritalStatus.DISSOLVED_REGISTERED_PARTNERSHIP;
        break;
      case 'Hinterbliebener eingetragene Partnerschaft':
        this.person.client.maritalStatus = MaritalStatus.SURVIVING_REGISTERED_PARTNERSHIP;
        break;
      default:
        this.person.client.maritalStatus = MaritalStatus.UNKNOWN;
    }
    console.log(this.m);
  }

  submit(): void {
    const theRealDate = this.dateAdapter.fromModel(this.dateOfBirth);
    console.log('this.person', this.person);
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
    this.clientService.updateClient(this.person.client.id, this.person).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      this.loading = true;
      console.log(result);
      this.commonService.setDemoSubject(true);
      this.loading = false;
    });
  }
}
