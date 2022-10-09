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
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {Time} from '../model/time';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {CategoryTypes} from '../model/category-types';

@Component({
  selector: 'app-create-counseling',
  templateUrl: './create-counseling.component.html',
  styleUrls: ['./create-counseling.component.css']
})
export class CreateCounselingComponent implements OnInit, OnDestroy {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  concernCategoryType: CategoryTypes = CategoryTypes.CONCERN_CATEGORY;
  activityCategoryType: CategoryTypes = CategoryTypes.ACTIVITY_CATEGORY;

  @Input() clientId: string;

  time: Time = {hour: 13, minute: 30};
  dateObject: NgbDateStruct;
  currentUser: User;

  private unsubscribe$: Subscription[] = [];

  loading = false;
  counselingForm: CounselingForm;

  counselingStatus: string;
  entryDate: string;
  counselingDate: string;
  counselingTime: string;
  concern: string;
  concernCategory: string;
  activity: string;
  activityCategory: string;
  registeredBy: string;
  faBars = faBars;
  concernCategories: Category[];
  activityCategories: Category[];
  category: Category;
  newCategory: string = null;
  newActivityCategory: string = null;
  categoryExists: string = null;
  activityCategoryIsCollapsed = true;
  concernCategoryIsCollapsed = true;

  concernLength = 2040;
  activityLength = 2040;

  constructor(
    private clientService: ClientService,
    private ngbFormatterService: NgbFormatterService,
    private dateAdapter: NgbDateAdapter<string>,
    private commonService: CommonService,
    public dateTimeService: DateTimeService,
    private categoryService: CategoryService,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.loadConcernCategories();
    this.loadActivityCategories();
  }

  concernLengthChange(val) {
    this.concernLength = 2040 - val.length;
  }

  activityLengthChange(val) {
    this.activityLength = 2040 - val.length;
  }

  private getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.registeredBy = this.currentUser.username;
  }

  onSubmit() {
    this.loading = true;
    const theRealDate = this.dateAdapter.fromModel(this.entryDate);
    this.counselingDate = this.dateTimeService.mergeDateAndTime(this.dateObject, this.time);
    this.counselingForm = {
      counselingStatus: this.counselingStatus,
      entryDate: this.ngbFormatterService.format(theRealDate),
      concern: this.concern,
      concernCategory: this.concernCategory,
      activity: this.activity,
      activityCategory: this.activityCategory,
      registeredBy: this.registeredBy,
      clientId: this.clientId,
      counselingDate: this.counselingDate
    };
    this.unsubscribe$.push(this.clientService.createCounseling(this.clientId, this.counselingForm).subscribe(result => {
      this.commonService.setCreateCounselingSubject(true);
      this.loading = false;
    }));
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  loadConcernCategories(): void {
    this.unsubscribe$.push(this.categoryService.getCategories(this.concernCategoryType).subscribe(cat => {
      this.concernCategories = cat;
    }));
  }

  loadActivityCategories(): void {
    this.unsubscribe$.push(this.categoryService.getCategories(this.activityCategoryType).subscribe(cat => {
      this.activityCategories = cat;
    }));
  }

  selectConcernCat(cat: Category) {
    this.concernCategory = cat.name;
  }

  selectActivityCat(cat: Category) {
    this.activityCategory = cat.name;
  }

  showActivityCat(event: string) {
    this.activityCategory = event;
  }

  showConcernCat(event: string) {
    this.concernCategory = event;
  }
}
