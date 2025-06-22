import {Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Client} from '../model/client';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Label} from '../model/label';
import {CITIZENSHIPS} from '../model/citizenships';
import {JsonPipe, NgForOf} from '@angular/common';
import {SelectBoxComponent} from '../select-box/single/select-box.component';
import {CategoryTypes} from '../model/category-types';
import {ClientForm} from '../model/clientForm';
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

  jobMarketAccessCategoriesToSelect: Category[];
  counselingLanguagesCategoriesToSelect: Category[];
  originOfAttentionCategoriesToSelect: Category[];

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

  private categoryService = inject(CategoryService);
  counselingLanguageModel = [];
  jobMarketAccessModel = [];
  originOfAttentionModel = [];

  ngOnInit(): void {
    if (this.client) {
      this.clientForm = this.mapClient(this.client);
      this.fillNgModels();
    } else {
      this.initializeClientForm();
    }
    this.loadCategoriesByCategoryType();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.client?.currentValue) {
      this.form?.patchValue(this.client);
    }
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  submit() {
    this.loading = true;
    this.showCategoryValue(this.counselingLanguageModel, CategoryTypes.COUNSELING_LANGUAGE);
    this.showCategoryValue(this.jobMarketAccessModel, CategoryTypes.JOB_MARKET_ACCESS);
    this.showCategoryValue(this.originOfAttentionModel, CategoryTypes.ORIGIN_OF_ATTENTION);
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

  showCategoryValue(event: string[], categoryType: CategoryTypes) {
    switch (categoryType) {
      case (CategoryTypes.COUNSELING_LANGUAGE):
        this.clientForm.counselingLanguageSelected = [];
        let joinCategoryCounselingLanguage: JoinCategory = null;
        event.forEach(e => {
          joinCategoryCounselingLanguage = this.createJoinCategory(e, categoryType, this.client.openCase.id, EntityTypes.CASE);
          this.clientForm.counselingLanguageSelected.push(joinCategoryCounselingLanguage);
        });
        break;
      case (CategoryTypes.JOB_MARKET_ACCESS):
        this.clientForm.jobMarketAccessSelected = [];
        let jobMarketAccessJoinCategory: JoinCategory = null;
        event.forEach(e => {
          jobMarketAccessJoinCategory = this.createJoinCategory(e, categoryType, this.client.openCase.id, EntityTypes.CASE);
          this.clientForm.jobMarketAccessSelected.push(jobMarketAccessJoinCategory);
        });
        break;
      case (CategoryTypes.ORIGIN_OF_ATTENTION):
        this.clientForm.originOfAttentionSelected = [];
        let originOfAttentionJoinCategory: JoinCategory = null;
        event.forEach(e => {
          originOfAttentionJoinCategory = this.createJoinCategory(e, categoryType, this.client.openCase.id, EntityTypes.CASE);
          this.clientForm.originOfAttentionSelected.push(originOfAttentionJoinCategory);
        });
    }
  }

  private createJoinCategory(categoryId: string, categoryType: CategoryTypes, entityId: string, entityType: EntityTypes): JoinCategory {
    return {
      categoryId: categoryId,
      categoryType: categoryType,
      entityId: this.client.openCase.id,
      entityType: entityType
    };
  }

  loadCategoriesByCategoryType(): void {
    this.subscription$.push(
      this.categoryService.getCategories(CategoryTypes.JOB_MARKET_ACCESS).subscribe(cat => {
        this.jobMarketAccessCategoriesToSelect = cat;
        console.log(this.jobMarketAccessCategoriesToSelect);
      })
    );
    this.subscription$.push(
      this.categoryService.getCategories(CategoryTypes.COUNSELING_LANGUAGE).subscribe(cat => {
        this.counselingLanguagesCategoriesToSelect = cat;
        console.log(this.counselingLanguagesCategoriesToSelect);
      })
    );
    this.subscription$.push(
      this.categoryService.getCategories(CategoryTypes.ORIGIN_OF_ATTENTION).subscribe(cat => {
        this.originOfAttentionCategoriesToSelect = cat;
        console.log(this.originOfAttentionCategoriesToSelect);
      })
    );
  }

  fillNgModels() {
    this.client.openCase.counselingLanguages.forEach(category => {
      this.counselingLanguageModel.push(category.id);
    });
    this.client.openCase.jobMarketAccess.forEach(category => {
      this.jobMarketAccessModel.push(category.id);
    });
    this.client.openCase.originOfAttention.forEach(category => {
      this.originOfAttentionModel.push(category.id);
    });
  }

  initializeClientForm() {
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
