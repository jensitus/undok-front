import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientForm} from '../model/clientForm';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {MaritalStatus} from '../model/marital-status.enum';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {NgbFormatterService} from '../../common/services/ngb-formatter.service';
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Country} from '../model/country.enum';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent implements OnInit, OnDestroy {

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

  constructor(
    private clientService: ClientService,
    private ngbFormatterService: NgbFormatterService,
    private dateAdapter: NgbDateAdapter<string>,
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.dateOfBirth = 'yyyy-mm-dd';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  private formTheDate(date: NgbDateStruct): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }

  submit(): void {
    const theRealDate = this.dateAdapter.fromModel(this.dateOfBirth);
    this.clientForm = {
      firstName: this.firstName,
      lastName: this.lastName,
      maritalStatus: this.m,
      dateOfBirth: this.ngbFormatterService.format(theRealDate),
      howHasThePersonHeardFromUs: this.howHasThePersonHeardFromUs,
      interpreterNecessary: this.interpreterNecessary,
      vulnerableWhenAssertingRights: this.vulnerableWhenAssertingRights,
      keyword: this.keyword,
      education: this.education,
      street: this.street,
      zipCode: this.zipCode,
      city: this.city,
      country: this.country
    };
    console.log(this.clientForm);
    this.clientService.createClient(this.clientForm).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log('client result', result);
      this.router.navigate(['/client/client-list']);
    });
  }

  onDateChange(dateForm): void {
    console.log(dateForm);
    // this.ngbFormatterService.format();
  }


  onMaritalChange(donner): void {
    switch (donner) {
      case 'unknown':
        this.m = MaritalStatus.UNKNOWN;
        break;
      case 'Ledig':
        this.m = MaritalStatus.SINGLE;
        break;
      case 'Verheiratet':
        this.m = MaritalStatus.MARRIED;
        break;
      case 'Geschieden':
        this.m = MaritalStatus.DIVORCED;
        break;
      case 'Verwitwet':
        this.m = MaritalStatus.WIDOWED;
        break;
      case 'Eingetragene Partnerschaft':
        this.m = MaritalStatus.REGISTERED_PARTNERSHIP;
        break;
      case 'Aufgelöste eingetragene Partnerschaft':
        this.m = MaritalStatus.DISSOLVED_REGISTERED_PARTNERSHIP;
        break;
      case 'Hinterbliebener eingetragene Partnerschaft':
        this.m = MaritalStatus.SURVIVING_REGISTERED_PARTNERSHIP;
        break;
      default:
        this.m = MaritalStatus.UNKNOWN;
    }
    console.log(this.m);
  }

  onCountryChange(country) {
    console.log(country);
    switch (country) {
      case 'Countries':
        this.country = 'Unknown';
        break;
      default:
        this.country = country;
    }
  }

}
