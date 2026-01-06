import {Component, inject, input, output, effect, signal, computed, DestroyRef} from '@angular/core';
import {Client} from '../model/client';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Label} from '../model/label';
import {CITIZENSHIPS} from '../model/citizenships';
import {SelectBoxComponent} from '../select-box/single/select-box.component';
import {CategoryTypes} from '../model/category-types';
import {ClientForm} from '../model/clientForm';
import {EntityTypes} from '../model/entity-types';
import {JoinCategory} from '../model/join-category';
import {Category} from '../model/category';
import {SelectModule} from '../select-box/select/select.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {CategoryService} from '../service/category.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  standalone: true,
  imports: [
    FormsModule,
    SelectBoxComponent,
    ReactiveFormsModule,
    SelectModule,
    NgSelectModule,
  ],
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {
  // Services
  private categoryService = inject(CategoryService);
  private destroyRef = inject(DestroyRef);

  // Constants
  readonly COMMENT_MAX_LENGTH = 2024;
  protected readonly CategoryTypes = CategoryTypes;
  protected readonly Label = Label;
  protected readonly citizenships = CITIZENSHIPS;
  readonly cat_working_relationship: CategoryTypes = CategoryTypes.WORKING_RELATIONSHIP;

  // Modern Angular 21 Input/Output
  client = input<Client>();
  submitted = output<ClientForm>();

  // Signals for state management
  clientForm = signal<ClientForm>(this.initializeClientForm());
  loading = signal(false);

  // Category data signals
  jobMarketAccessCategoriesToSelect = signal<Category[]>([]);
  counselingLanguagesCategoriesToSelect = signal<Category[]>([]);
  originOfAttentionCategoriesToSelect = signal<Category[]>([]);
  undocumentedWorkCategoriesToSelect = signal<Category[]>([]);
  complaintsToSelected = signal<Category[]>([]);
  industryUnionToSelect = signal<Category[]>([]);
  jobFunctionToSelect = signal<Category[]>([]);
  sectorToSelect = signal<Category[]>([]);

  // Model signals for ng-select
  counselingLanguageModel = signal<string[]>([]);
  jobMarketAccessModel = signal<string[]>([]);
  originOfAttentionModel = signal<string[]>([]);
  undocumentedWorkModel = signal<string[]>([]);
  complaintsModel = signal<string[]>([]);
  industryUnionModel = signal<string[]>([]);
  jobFunctionModel = signal<string[]>([]);
  sectorModel = signal<string[]>([]);

  // Computed for remaining characters
  remainingCharacters = computed(() => {
    const comment = this.clientForm().comment;
    return this.COMMENT_MAX_LENGTH - (comment?.length || 0);
  });

  constructor() {
    // Load categories on initialization
    this.loadCategoriesByCategoryType();

    // Effect to handle client input changes
    effect(() => {
      const client = this.client();
      if (client) {
        this.clientForm.set(this.mapClient(client));
        this.fillNgModels(client);
      }
    }, {allowSignalWrites: true});
  }

  submit() {
    this.loading.set(true);
    const form = this.clientForm();

    this.processCategorySelections(form);

    this.submitted.emit(form);
    this.loading.set(false);
  }

  private processCategorySelections(form: ClientForm) {
    this.showCategoryValue(this.counselingLanguageModel(), CategoryTypes.COUNSELING_LANGUAGE, form);
    this.showCategoryValue(this.jobMarketAccessModel(), CategoryTypes.JOB_MARKET_ACCESS, form);
    this.showCategoryValue(this.originOfAttentionModel(), CategoryTypes.ORIGIN_OF_ATTENTION, form);
    this.showCategoryValue(this.undocumentedWorkModel(), CategoryTypes.UNDOCUMENTED_WORK, form);
    this.showCategoryValue(this.complaintsModel(), CategoryTypes.COMPLAINT, form);
    this.showCategoryValue(this.industryUnionModel(), CategoryTypes.INDUSTRY_UNION, form);
    this.showCategoryValue(this.jobFunctionModel(), CategoryTypes.JOB_FUNCTION, form);
    this.showCategoryValue(this.sectorModel(), CategoryTypes.SECTOR, form);
  }

  selectGender(event: string) {
    this.clientForm.update(form => ({...form, gender: event}));
  }

  selectResidentStatus(event: string) {
    this.clientForm.update(form => ({...form, currentResidentStatus: event}));
  }

  onCitizenshipChange(value: any) {
    this.clientForm.update(form => ({...form, nationality: value}));
  }

  selectTargetGroup(event: string) {
    this.clientForm.update(form => ({...form, targetGroup: event}));
  }

  selectWorkingRelationship(event: string) {
    this.clientForm.update(form => ({...form, workingRelationship: event}));
  }

  updateFormField<K extends keyof ClientForm>(field: K, value: ClientForm[K]) {
    this.clientForm.update(form => ({...form, [field]: value}));
  }

  mapClient(client: Client): ClientForm {
    return {
      keyword: client.keyword ?? null,
      firstName: client.firstName ?? null,
      lastName: client.lastName ?? null,
      telephone: client.telephone ?? null,
      city: client.city ?? null,
      email: client.email ?? null,
      labourMarketAccess: client.labourMarketAccess ?? null,
      interpreterNecessary: client.interpreterNecessary ?? null,
      howHasThePersonHeardFromUs: client.howHasThePersonHeardFromUs ?? null,
      vulnerableWhenAssertingRights: client.vulnerableWhenAssertingRights ?? null,
      nationality: client.nationality ?? null,
      language: client.language ?? null,
      currentResidentStatus: client.currentResidentStatus ?? null,
      jobCenterBlock: client.openCase?.jobCenterBlock ?? null,
      humanTrafficking: client.openCase?.humanTrafficking ?? null,
      gender: client.gender ?? null,
      union: client.union ?? null,
      targetGroup: client.openCase?.targetGroup ?? null,
      workingRelationship: client.openCase?.workingRelationship ?? null,
      furtherContact: client.furtherContact ?? null,
      comment: client.comment ?? null,
      alert: client.alert ?? null,
    };
  }

  showCategoryValue(eventIds: string[], categoryType: CategoryTypes, form: ClientForm) {
    const client = this.client();
    if (!client) { return; }

    const joinCategories = eventIds.map(id =>
      this.createJoinCategory(id, categoryType, client.openCase.id, EntityTypes.CASE)
    );

    switch (categoryType) {
      case CategoryTypes.COUNSELING_LANGUAGE:
        form.counselingLanguageSelected = joinCategories;
        break;
      case CategoryTypes.JOB_MARKET_ACCESS:
        form.jobMarketAccessSelected = joinCategories;
        break;
      case CategoryTypes.ORIGIN_OF_ATTENTION:
        form.originOfAttentionSelected = joinCategories;
        break;
      case CategoryTypes.UNDOCUMENTED_WORK:
        form.undocumentedWorkSelected = joinCategories;
        break;
      case CategoryTypes.COMPLAINT:
        form.complaintsSelected = joinCategories;
        break;
      case CategoryTypes.INDUSTRY_UNION:
        form.industryUnionSelected = joinCategories;
        break;
      case CategoryTypes.JOB_FUNCTION:
        form.jobFunctionSelected = joinCategories;
        break;
      case CategoryTypes.SECTOR:
        form.sectorSelected = joinCategories;
        break;
    }
  }

  private createJoinCategory(
    categoryId: string,
    categoryType: CategoryTypes,
    entityId: string,
    entityType: EntityTypes
  ): JoinCategory {
    return {
      categoryId,
      categoryType,
      entityId,
      entityType
    };
  }

  loadCategoriesByCategoryType(): void {
    this.categoryService.getCategories(CategoryTypes.JOB_MARKET_ACCESS)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(cat => this.jobMarketAccessCategoriesToSelect.set(cat));

    this.categoryService.getCategories(CategoryTypes.COUNSELING_LANGUAGE)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(cat => this.counselingLanguagesCategoriesToSelect.set(cat));

    this.categoryService.getCategories(CategoryTypes.ORIGIN_OF_ATTENTION)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(cat => this.originOfAttentionCategoriesToSelect.set(cat));

    this.categoryService.getCategories(CategoryTypes.UNDOCUMENTED_WORK)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(cat => this.undocumentedWorkCategoriesToSelect.set(cat));

    this.categoryService.getCategories(CategoryTypes.COMPLAINT)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(cat => this.complaintsToSelected.set(cat));

    this.categoryService.getCategories(CategoryTypes.INDUSTRY_UNION)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(cat => this.industryUnionToSelect.set(cat));

    this.categoryService.getCategories(CategoryTypes.JOB_FUNCTION)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(cat => this.jobFunctionToSelect.set(cat));

    this.categoryService.getCategories(CategoryTypes.SECTOR)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(cat => this.sectorToSelect.set(cat));
  }

  fillNgModels(client: Client) {
    this.counselingLanguageModel.set(
      client.openCase?.counselingLanguages?.map(c => c.id) ?? []
    );
    this.jobMarketAccessModel.set(
      client.openCase?.jobMarketAccess?.map(c => c.id) ?? []
    );
    this.originOfAttentionModel.set(
      client.openCase?.originOfAttention?.map(c => c.id) ?? []
    );
    this.undocumentedWorkModel.set(
      client.openCase?.undocumentedWork?.map(c => c.id) ?? []
    );
    this.complaintsModel.set(
      client.openCase?.complaints?.map(c => c.id) ?? []
    );
    this.industryUnionModel.set(
      client.openCase?.industryUnion?.map(c => c.id) ?? []
    );
    this.jobFunctionModel.set(
      client.openCase?.jobFunction?.map(c => c.id) ?? []
    );
    this.sectorModel.set(
      client.openCase?.sector?.map(c => c.id) ?? []
    );
  }

  initializeClientForm(): ClientForm {
    return {
      keyword: null,
      firstName: null,
      lastName: null,
      gender: null,
      labourMarketAccess: null,
      interpreterNecessary: null,
      howHasThePersonHeardFromUs: null,
      vulnerableWhenAssertingRights: null,
      nationality: null,
      language: null,
      sector: null,
      union: null,
      currentResidentStatus: null,
      jobCenterBlock: false,
      humanTrafficking: false,
      targetGroup: null,
      workingRelationship: null,
      alert: false,
    };
  }
}
