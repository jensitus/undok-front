import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../service/client.service';
import {publish, Subscription} from 'rxjs';
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

@Component({
  selector: 'app-create-counseling',
  templateUrl: './create-counseling.component.html',
  styleUrls: ['./create-counseling.component.css']
})
export class CreateCounselingComponent implements OnInit, OnDestroy {

  CONCERN_CATEGORY = 'concernCategory';
  ACTIVITY_CATEGORY = 'activityCategory';

  @Input() clientId: string;

  time = {hour: 13, minute: 30};
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

  private getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.registeredBy = this.currentUser.username;
  }

  onSubmit() {
    this.loading = true;
    const theRealDate = this.dateAdapter.fromModel(this.entryDate);
    this.counselingDate = this.dateTimeService.mergeDateAndTime(this.dateObject);
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
    this.unsubscribe$.push(this.categoryService.getCategories(this.CONCERN_CATEGORY).subscribe(cat => {
      this.concernCategories = cat;
    }));
  }

  loadActivityCategories(): void {
    this.unsubscribe$.push(this.categoryService.getCategories(this.ACTIVITY_CATEGORY).subscribe(cat => {
      this.activityCategories = cat;
    }));
  }

  selectConcernCat(cat: Category) {
    this.concernCategory = cat.name;
  }

  selectActivityCat(cat: Category) {
    this.activityCategory = cat.name;
  }

  addNewCategory(type: string) {
    let category: Category;

    switch (type) {
      case this.CONCERN_CATEGORY:
        category = {
          name: this.newCategory,
          type: type
        };
        break;
      case this.ACTIVITY_CATEGORY:
        category = {
          name: this.newActivityCategory,
          type: type
        };
    }
    this.unsubscribe$.push(this.categoryService.addCategory(category).subscribe((r) => {
      console.log('unsubscribe$', this.unsubscribe$);
      this.newCategory = null;
      this.newActivityCategory = null;
      this.loadConcernCategories();
      this.loadActivityCategories();
    }, error => {
      this.categoryExists = error.error;
    }));

  }

}
