import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Subscription} from 'rxjs';
import {CounselingForm} from '../model/counseling-form';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbFormatterService} from '../../common/services/ngb-formatter.service';
import {CommonService} from '../../common/services/common.service';
import {DateTimeService} from '../service/date-time.service';
import {User} from '../../auth/model/user';
import {Category} from '../model/category';
import {CategoryService} from '../service/category.service';
import {Time} from '../model/time';
import {CategoryTypes} from '../model/category-types';
import {DropdownItem} from '../model/dropdown-item';
import {EntityTypes} from '../model/entity-types';
import {JoinCategory} from '../model/join-category';
import {ActivatedRoute, Router} from '@angular/router';
import {Client} from '../model/client';
import {Label} from '../model/label';

@Component({
  selector: 'app-create-counseling',
  templateUrl: './create-counseling.component.html',
  styleUrls: ['./create-counseling.component.css']
})
export class CreateCounselingComponent implements OnInit, OnDestroy {

  concernCategoryType: CategoryTypes = CategoryTypes.CONCERN_CATEGORY;
  legalCategoryType: CategoryTypes = CategoryTypes.LEGAL;
  activityCategoryType: CategoryTypes = CategoryTypes.ACTIVITY;
  activityLabel: Label = Label.ACTIVITY;
  legalLabel: Label = Label.LEGAL;
  CONCERN_LENGTH = 4080;
  ACTIVITY_LENGTH = 4080;

  clientId: string;
  client: Client;
  @Input() clientFirstName: string;
  @Input() clientLastName: string;
  @Input() clientKeyword: string;



  private counselingId: string;

  time: Time = {hour: 13, minute: 30};
  dateObject: NgbDateStruct;
  currentUser: User;

  private subscription$: Subscription[] = [];

  loading = false;
  counselingForm: CounselingForm;

  counselingStatus: string;
  entryDate: string;
  counselingDate: string;
  concern: string;
  concernCategory: string;
  activity: string;
  legalCategory: string;
  registeredBy: string;
  faBars = faBars;
  concernCategories: Category[];
  legalCategories: Category[];
  category: Category;

  concernLength = this.CONCERN_LENGTH;
  activityLength = this.ACTIVITY_LENGTH;

  joinCategories: JoinCategory[] = [];
  joinCategory: JoinCategory;
  private dropdownEvents: DropdownItem[] = [];

  constructor(
    private clientService: ClientService,
    private ngbFormatterService: NgbFormatterService,
    private dateAdapter: NgbDateAdapter<string>,
    private commonService: CommonService,
    public dateTimeService: DateTimeService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.clientId = params['id'];
    });
    this.getCurrentUser();
    this.loadConcernCategories();
    this.loadLegalCategories();
    this.subscription$.push(this.clientService.getSingleClient(this.clientId).subscribe(client => {
      this.client = client;
      this.onSubmit();
    }));
  }

  concernLengthChange(val) {
    this.concernLength = this.CONCERN_LENGTH - val.length;
  }

  activityLengthChange(val) {
    this.activityLength = this.ACTIVITY_LENGTH - val.length;
  }

  private getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.registeredBy = this.currentUser.username;
  }

  onSubmit() {
    this.loading = true;
    // const theRealDate = this.dateAdapter.fromModel(this.entryDate);
    // this.counselingDate = this.dateTimeService.mergeDateAndTime(this.dateObject, this.time);
    this.counselingForm = {
      // counselingStatus: this.counselingStatus,
      // entryDate: this.ngbFormatterService.format(theRealDate),
      // concern: this.concern,
      // concernCategory: this.concernCategory,
      // activity: this.activity,
      // activityCategory: this.legalCategory,
      registeredBy: this.registeredBy,
      clientId: this.clientId,
      // counselingDate: this.counselingDate
    };
    this.subscription$.push(this.clientService.createCounseling(this.clientId, this.counselingForm).subscribe(result => {
      this.counselingId = result.id;
      // this.addJoinCategories(this.counselingId);
      // this.commonService.setCreateCounselingSubject(true);
      // this.sendJoinCategoriesToTheServer(result.id);
      this.loading = false;
      this.router.navigate(['/clients/' + this.clientId + '/counselings/' + this.counselingId]);
    }));
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  sendJoinCategoriesToTheServer(counselingId: string) {
    this.subscription$.push(this.categoryService.addJoinCategories(this.joinCategories).subscribe(join => {
      this.router.navigate(['/clients/' + this.clientId + '/counselings/' + counselingId]);
    }));
  }

  loadConcernCategories(): void {
    this.subscription$.push(this.categoryService.getCategories(this.concernCategoryType).subscribe(cat => {
      this.concernCategories = cat;
    }));
  }

  loadLegalCategories(): void {
    this.subscription$.push(this.categoryService.getCategories(this.legalCategoryType).subscribe(cat => {
      this.legalCategories = cat;
    }));
  }

  selectConcernCat(cat: Category) {
    this.concernCategory = cat.name;
  }

  selectLegalCategory(cat: Category) {
    this.legalCategory = cat.name;
  }

  showLegalCategory(event: string) {
    this.legalCategory = event;
  }

  showConcernCat(event: string) {
    this.concernCategory = event;
  }
  showLegalCategoryValue(event: DropdownItem[]) {
    this.dropdownEvents = event;
  }

  showActivityCategoryValue(event: DropdownItem[]) {
    this.dropdownEvents = event;
  }

  addJoinCategories(counselingId: string) {
    this.joinCategories = [];
    this.dropdownEvents.forEach(e => {
      this.joinCategory = {
        categoryId: e.itemId,
        categoryType: CategoryTypes.LEGAL,
        entityId: counselingId,
        entityType: EntityTypes.COUNSELING
      };
      this.joinCategories.push(this.joinCategory);
    });
  }

}
