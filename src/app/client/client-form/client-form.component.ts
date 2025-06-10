import {Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Client} from '../model/client';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Label} from '../model/label';
import {CITIZENSHIPS} from '../model/citizenships';
import {JsonPipe, NgForOf} from '@angular/common';
import {SelectBoxComponent} from '../select-box/single/select-box.component';
import {CategoryTypes} from '../model/category-types';
import {ClientForm} from '../model/clientForm';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ClientService} from '../service/client.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    SelectBoxComponent,
    ReactiveFormsModule,
    JsonPipe
  ],
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit, OnChanges, OnDestroy {

  constructor() { }

  @Input() client: Client;
  @Output() submitted = new EventEmitter<ClientForm>();
  form: FormGroup;
  clientForm: ClientForm;

  protected readonly Label = Label;
  protected readonly citizenships = CITIZENSHIPS;
  cat_gender: CategoryTypes = CategoryTypes.CAT_GENDER;
  cat_sector: CategoryTypes = CategoryTypes.SECTOR;
  cat_aufenthaltstitel: CategoryTypes = CategoryTypes.AUFENTHALTSTITEL;
  loading = false;
  cat_target_group: CategoryTypes = CategoryTypes.TARGET_GROUP;
  cat_working_relationship: CategoryTypes = CategoryTypes.WORKING_RELATIONSHIP;

  ngOnInit(): void {
    if (this.client) {
      this.clientForm = this.mapClient(this.client);
    } else {
      this.clientForm = {
        keyword: null,
        firstName: null,
        lastName: null,
        gender: null,
        labourMarketAccess: null,
        interpreterNecessary: false,
        howHasThePersonHeardFromUs: null,
        vulnerableWhenAssertingRights: false,
        nationality: null,
        language: null,
        sector: null,
        union: null,
        currentResidentStatus: null,
        jobCenterBlock: false,
        humanTrafficking: false,
        targetGroup: null,
        workingRelationship: null,
      };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.client?.currentValue) {
      this.form?.patchValue(this.client);
    }
  }

  ngOnDestroy(): void {
  }

  submit() {
    this.loading = true;
    this.submitted.emit(this.clientForm);
  }

  selectGender(event: string) {
    this.clientForm.gender = event;
  }

  selectSector(event: string) {
    this.clientForm.sector = event;
  }

  selectResidentStatus(event: string) {
    this.clientForm.currentResidentStatus = event;
  }

  onCitizenshipChange(value: any) {
    this.clientForm.nationality = value;
  }

  selectTargetGroup(event: string) {
    this.clientForm.targetGroup = event;
  }

  selectWorkingRelationship(event: string) {
    this.clientForm.workingRelationship = event;
  }

  mapClient(client: Client): ClientForm {
    return {
      keyword: client.keyword ? client.keyword : null,
      firstName: client.person.firstName ? client.person.firstName : null,
      lastName: client.person.lastName ? client.person.lastName : null,
      telephone: client.person.telephone ? client.person.telephone : null,
      city: client.person.address.city ? client.person.address.city : null,
      email: client.person.email ? client.person.email : null,
      labourMarketAccess: client.labourMarketAccess ? client.labourMarketAccess : null,
      interpreterNecessary: client.interpreterNecessary ? client.interpreterNecessary : false,
      howHasThePersonHeardFromUs: client.howHasThePersonHeardFromUs ? client.howHasThePersonHeardFromUs : null,
      vulnerableWhenAssertingRights: client.vulnerableWhenAssertingRights ? client.vulnerableWhenAssertingRights : null,
      nationality: client.nationality ? client.nationality : null,
      language: client.language ? client.language : null,
      currentResidentStatus: client.currentResidentStatus ? client.currentResidentStatus : null,
      jobCenterBlock: client.openCase.jobCenterBlock ? client.openCase.jobCenterBlock : null,
      humanTrafficking: client.openCase.humanTrafficking ? client.openCase.humanTrafficking : null,
      gender: client.person.gender ? client.person.gender : null,
      sector: client.sector ? client.sector : null,
      union: client.union ? client.union : null,
      targetGroup: client.openCase.targetGroup ? client.openCase.targetGroup : null,
      workingRelationship: client.openCase.workingRelationship ? client.openCase.workingRelationship : null,
    };
  }

}
