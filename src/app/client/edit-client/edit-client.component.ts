import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ClientForm} from '../model/clientForm';
import {Subscription} from 'rxjs';
import {ClientService} from '../service/client.service';
import {NgbFormatterService} from '../../common/services/ngb-formatter.service';
import {NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';
import {Router} from '@angular/router';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {Client} from '../model/client';
import {ResidentStatus} from '../model/resident-status.enum';
import {COUNTRIES_AT} from '../model/countriesAT';
import {MARITAL_STATUS} from '../model/marital-status';
import {CITIZENSHIPS} from '../model/citizenships';
import {CategoryTypes} from '../model/category-types';

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
  maritalStatus = MARITAL_STATUS;
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
  nationality: string;
  country: string;
  countries = COUNTRIES_AT;
  citizenships = CITIZENSHIPS;
  residentStatusLOV = Object.values(ResidentStatus);
  currentResidentStatus: string;

  loading = false;
  cat_gender: CategoryTypes = CategoryTypes.CAT_GENDER;

  constructor(
    private clientService: ClientService,
    private ngbFormatterService: NgbFormatterService,
    private dateAdapter: NgbDateAdapter<string>,
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.country = this.client.person.address.country;
    this.nationality = this.client.nationality;
    this.marital = this.client.maritalStatus;
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

  onCitizenshipChange(country): void {
    this.client.nationality = country;
  }

  onMaritalChange(marital): void {
    this.client.maritalStatus = marital;
  }

  submit(): void {
    const theRealDate = this.dateAdapter.fromModel(this.dateOfBirth);
    const dateOfBirth = this.ngbFormatterService.format(theRealDate);
    this.client.person.dateOfBirth = dateOfBirth;
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

  onGenderChange(event: string) {
    this.client.person.gender = event;
  }
}
