import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Counseling} from '../model/counseling';
import {CounselingService} from '../service/counseling.service';
import {Subscription} from 'rxjs';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {DateTimeService} from '../service/date-time.service';
import {CommonService} from '../../common/services/common.service';
import {Category} from '../model/category';
import {CategoryService} from '../service/category.service';

@Component({
  selector: 'app-edit-counseling',
  templateUrl: './edit-counseling.component.html',
  styleUrls: ['./edit-counseling.component.css']
})
export class EditCounselingComponent implements OnInit, OnDestroy {

  CONCERN_CATEGORY = 'concernCategory';
  ACTIVITY_CATEGORY = 'activityCategory';

  @Input() public counseling: Counseling;
  private unsubscribe$: Subscription[] = [];
  faBars = faBars;
  dateObject: NgbDateStruct;
  time = {hour: 13, minute: 30};
  loading = false;
  concernCategories: Category[];
  activityCategories: Category[];
  category: Category;
  newCategory: string = null;
  newActivityCategory: string = null;
  categoryExists: string = null;

  constructor(
    private counselingService: CounselingService,
    public dateTimeService: DateTimeService,
    private commonService: CommonService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadActivityCategories();
    this.loadConcernCategories();
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  onSubmit() {
    this.loading = true;
    this.unsubscribe$.push(this.counselingService.updateCounseling(this.counseling.id, this.counseling).subscribe(res => {
      this.commonService.setCreateCounselingSubject(true);
      this.loading = false;
    }));
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
        break;
    }
    this.unsubscribe$.push(this.categoryService.addCategory(category).subscribe((r) => {
      this.newCategory = null;
      this.newActivityCategory = null;
      this.loadConcernCategories();
      this.loadActivityCategories();
    }, error => {
      this.categoryExists = error.error;
    }));
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
    this.counseling.concernCategory = cat.name;
  }

  selectActivityCat(cat: Category) {
    this.counseling.activityCategory = cat.name;
  }

}
