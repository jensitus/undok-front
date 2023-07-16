import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientForm} from '../model/clientForm';
import {Subscription} from 'rxjs';
import {ClientService} from '../service/client.service';
import {NgbFormatterService} from '../../common/services/ngb-formatter.service';
import {NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';
import {ActivatedRoute, Router} from '@angular/router';
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

  client: Client | undefined;

  client_id: string;
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
  cat_aufenthaltstitel: CategoryTypes = CategoryTypes.AUFENTHALTSTITEL;
  cat_sector: CategoryTypes = CategoryTypes.SECTOR;

  constructor(
    private clientService: ClientService,
    private ngbFormatterService: NgbFormatterService,
    private dateAdapter: NgbDateAdapter<string>,
    private commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    // this.country = this.client.person.address.country;
    // this.nationality = this.client.nationality;
    // this.marital = this.client.maritalStatus;
    this.unsubscribe$.push(
      this.activatedRoute.params.subscribe({
        next: (params) => {
          this.client_id = params['id'];
          this.unsubscribe$.push(
            this.clientService.getSingleClient(this.client_id).subscribe({
              next: (client) => {
                this.client = client;
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

  onCountryChange(country) {
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
    this.client.person.dateOfBirth = this.ngbFormatterService.format(theRealDate);
    this.unsubscribe$.push(
      this.clientService.updateClient(this.client.id, this.client).subscribe({
        next: () => {
          this.loading = true;
          this.commonService.setDemoSubject(true);
          this.loading = false;
          this.router.navigate(['clients/', this.client_id]);
        }
      })
    );
  }

  onGenderChange(event: string) {
    this.client.person.gender = event;
  }

  changeResidentStatus(event: string) {
    this.client.currentResidentStatus = event;
  }

  changeSector(event: string) {
    this.client.sector = event;
  }
}
