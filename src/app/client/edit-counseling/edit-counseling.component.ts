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
import {CategoryTypes} from '../model/category-types';
import {DropdownItem} from '../model/dropdown-item';
import {JoinCategory} from '../model/join-category';
import {EntityTypes} from '../model/entity-types';

@Component({
  selector: 'app-edit-counseling',
  templateUrl: './edit-counseling.component.html',
  styleUrls: ['./edit-counseling.component.css']
})
export class EditCounselingComponent implements OnInit, OnDestroy {

  CONCERN_MAX_LENGTH = 4080;
  ACTIVITY_MAX_LENGTH = 4080;
  concernCategoryType: CategoryTypes = CategoryTypes.CONCERN_CATEGORY;
  activityCategoryType: CategoryTypes = CategoryTypes.ACTIVITY_CATEGORY;

  @Input() public counseling: Counseling;
  private subscription$: Subscription[] = [];
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
  activityCategoryIsCollapsed = true;
  concernCategoryIsCollapsed = true;
  joinCategories: JoinCategory[] = [];
  joinCategory: JoinCategory;
  deSelectedItems: DropdownItem[] = [];
  deSelectedCategories: JoinCategory[] = [];

  constructor(
    private counselingService: CounselingService,
    public dateTimeService: DateTimeService,
    private commonService: CommonService,
    private categoryService: CategoryService
  ) {
  }

  ngOnInit(): void {
    this.loadActivityCategories();
    this.loadConcernCategories();
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  onSubmit() {
    this.loading = true;
    this.deSelectedItems.forEach((deSelected) => {
      const deselect: JoinCategory = {
        entityType: 'COUNSELING',
        entityId: this.counseling.id,
        categoryType: CategoryTypes.ACTIVITY_CATEGORY,
        categoryId: deSelected.itemId
      };
      this.deSelectedCategories.push(deselect);
    });
    this.subscription$.push(this.categoryService.deleteJoinCategories(this.deSelectedCategories).subscribe(res => {
    }));
    this.subscription$.push(this.counselingService.updateCounseling(this.counseling.id, this.counseling).subscribe(res => {

    }));
    this.subscription$.push(this.categoryService.addJoinCategories(this.joinCategories).subscribe(join => {
      this.commonService.setReloadSubject(true);
    }));
    this.loading = false;
  }

  loadConcernCategories(): void {
    this.subscription$.push(this.categoryService.getCategories(this.concernCategoryType).subscribe(cat => {
      console.log(this.concernCategories);
    }));
  }

  loadActivityCategories(): void {
    this.subscription$.push(this.categoryService.getCategories(this.activityCategoryType).subscribe(cat => {
      this.activityCategories = cat;
    }));
  }

  selectConcernCat(cat: Category) {
    this.counseling.concernCategory = cat.name;
  }

  selectActivityCat(cat: Category) {
    // this.counseling.activityCategory = cat.name;
  }

  showConcernCat(event: string) {
    this.counseling.concernCategory = event;
  }

  // showActivityCat(event: string) {
  //   // this.counseling.activityCategory = event;
  // }

  showActivityCatValue(event: DropdownItem[]) {
    this.joinCategories = [];
    event.forEach(e => {
      this.joinCategory = {
        categoryId: e.itemId,
        categoryType: CategoryTypes.ACTIVITY_CATEGORY,
        entityId: this.counseling.id,
        entityType: EntityTypes.COUNSELING
      };
      this.joinCategories.push(this.joinCategory);
    });
  }

  showDeSelected(event: DropdownItem[]) {
    console.log('edit counseling: deSelected', event);
    this.deSelectedItems = event;
  }

}
