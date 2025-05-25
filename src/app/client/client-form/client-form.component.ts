import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Client} from '../model/client';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Label} from '../model/label';
import {CITIZENSHIPS} from '../model/citizenships';
import {NgForOf} from '@angular/common';
import {SelectBoxComponent} from '../select-box/single/select-box.component';
import {CategoryTypes} from '../model/category-types';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    SelectBoxComponent,
    ReactiveFormsModule
  ],
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit, OnChanges, OnDestroy {

  constructor(private fb: FormBuilder) { }

  @Input() client: Client;
  @Output() submitted = new EventEmitter<Client>();
  form: FormGroup;

  protected readonly Label = Label;
  protected readonly citizenships = CITIZENSHIPS;
  cat_gender: CategoryTypes;
  cat_sector: CategoryTypes;
  cat_aufenthaltstitel: CategoryTypes;
  loading = false;

  ngOnInit(): void {
    this.form = this.fb.group({
    id: [null],
      keyword: [''],
      education: [null],
      maritalStatus: [null],
      interpreterNecessary: [null],
      howHasThePersonHeardFromUs: [null],
      vulnerableWhenAssertingRights: [null],
      counselings: [null],
      person: [null],

      nationality: [null],
      language: [null],
      currentResidentStatus: [null],
      formerResidentStatus: [null],
      labourMarketAccess: [null],
      position: [null],
      sector: [null],
      union: [null],
      membership: [null],
      organization: [null],
      socialInsuranceNumber: [null],
      closedCases: [null],
      openCase: [null],
      jobFunctions: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.client?.currentValue) {
      this.form?.patchValue(this.client);
    }
  }

  ngOnDestroy(): void {
  }

  submit() {
    this.submitted.emit(this.form.getRawValue());
    this.form.reset();
  }

  selectGender(event: string) {

  }

  selectSector(event: string) {

  }

  selectResidentStatus(event: string) {

  }

  onCitizenshipChange(value: any) {

  }
}
