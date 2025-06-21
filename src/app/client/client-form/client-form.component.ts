import {Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Client} from '../model/client';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Label} from '../model/label';
import {CITIZENSHIPS} from '../model/citizenships';
import {JsonPipe, NgForOf} from '@angular/common';
import {SelectBoxComponent} from '../select-box/single/select-box.component';
import {CategoryTypes} from '../model/category-types';
import {ClientForm} from '../model/clientForm';
import {DropdownItem} from '../model/dropdown-item';
import {EntityTypes} from '../model/entity-types';
import {JoinCategory} from '../model/join-category';
import {Category} from '../model/category';
import {SelectModule} from '../select-box/select/select.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {Subscription} from 'rxjs';
import {CategoryService} from '../service/category.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    SelectBoxComponent,
    ReactiveFormsModule,
    JsonPipe,
    SelectModule,
    NgSelectModule,
  ],
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit, OnChanges, OnDestroy {

  constructor() {
  }

  selectedJobMarketAccess: Category[] = [];
  selectedCounselingLanguages: Category[] = [];
  cars = [
    {id: 1, name: 'Volvo'},
    {id: 2, name: 'Saab', disabled: true},
    {id: 3, name: 'Opel'},
    {id: 4, name: 'Audi'},
  ];
  jobMarketAccessCategoriesToSelect: Category[];
  counselingLanguagesCategoriesToSelect: Category[];

  @Input() client: Client;
  @Output() submitted = new EventEmitter<ClientForm>();
  form: FormGroup;
  clientForm: ClientForm;
  protected readonly CategoryTypes = CategoryTypes;

  protected readonly Label = Label;
  protected readonly citizenships = CITIZENSHIPS;
  loading = false;
  cat_working_relationship: CategoryTypes = CategoryTypes.WORKING_RELATIONSHIP;

  private subscription$: Subscription[] = [];

  deSelectedItems: DropdownItem[] = [];
  jobMarketAccessSelected: Category[] = [];
  jobMarketAccessType: CategoryTypes = CategoryTypes.JOB_MARKET_ACCESS;
  private categoryService = inject(CategoryService);

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
    this.loadCategoriesByCategoryType();
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
    this.showCategoryValue(this.selectedCounselingLanguages, CategoryTypes.COUNSELING_LANGUAGE);
    this.showCategoryValue(this.selectedJobMarketAccess, CategoryTypes.JOB_MARKET_ACCESS);
    console.log('client Form ', this.clientForm);
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

  showCategoryValue(event: Category[], categoryType: CategoryTypes) {
    switch (categoryType) {
      case (CategoryTypes.COUNSELING_LANGUAGE):
        this.clientForm.counselingLanguageSelected = [];
        let joinCategoryCounselingLanguage: JoinCategory = null;
        event.forEach(e => {
          joinCategoryCounselingLanguage = {
            categoryId: e.id,
            categoryType: categoryType,
            entityId: this.client.openCase.id,
            entityType: EntityTypes.CASE
          };
          this.clientForm.counselingLanguageSelected.push(joinCategoryCounselingLanguage);
        });
        break;
      case (CategoryTypes.JOB_MARKET_ACCESS):
        this.clientForm.jobMarketAccessSelected = [];
        let jobMarketAccessJoinCategory: JoinCategory = null;
        event.forEach(e => {
          jobMarketAccessJoinCategory = {
            categoryId: e.id,
            categoryType: categoryType,
            entityId: this.client.openCase.id,
            entityType: EntityTypes.CASE
          };
          this.clientForm.jobMarketAccessSelected.push(jobMarketAccessJoinCategory);
        });
        break;
    }
    console.log('this.clientForm.jobMarketAccessSelected', this.clientForm.jobMarketAccessSelected);
    console.log('this.clientForm.counselingLanguageSelected', this.clientForm.counselingLanguageSelected);
  }

  showDeSelected(event: DropdownItem[], categoryType: CategoryTypes) {
    switch (categoryType) {
      case (CategoryTypes.COUNSELING_LANGUAGE):
        this.clientForm.counselingLanguageDeSelected = [];
        event.forEach(e => {
          const deselectCounselingLanguage: JoinCategory = {
            categoryId: e.itemId,
            categoryType: categoryType,
            entityId: this.client.id,
            entityType: EntityTypes.CLIENT
          };
          this.clientForm.counselingLanguageDeSelected.push(deselectCounselingLanguage);
        });
        break;
    }
    // this.deSelectedItems = event;
    console.log('this.clientForm.counselingLanguageDeSelected', this.clientForm.counselingLanguageDeSelected);
  }

  loadCategoriesByCategoryType(): void {
    this.subscription$.push(
      this.categoryService.getCategories(CategoryTypes.JOB_MARKET_ACCESS).subscribe(cat => {
        this.jobMarketAccessCategoriesToSelect = cat;
      })
    );
    this.subscription$.push(
      this.categoryService.getCategories(CategoryTypes.COUNSELING_LANGUAGE).subscribe(cat => {
        this.counselingLanguagesCategoriesToSelect = cat;
      })
    );
  }

}
