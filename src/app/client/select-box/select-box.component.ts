import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Category} from '../model/category';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';
import {CategoryService} from '../service/category.service';
import {CategoryTypes} from '../model/category-types';


@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.css']
})
export class SelectBoxComponent implements OnInit, OnDestroy {

  CONCERN_CATEGORY = 'concernCategory';
  ACTIVITY_CATEGORY = 'activityCategory';

  @Input() categoryType: CategoryTypes;
  activityCategory: string;
  concernCategory: string;

  @Output()
  catValue = new EventEmitter<string>();

  faBars = faBars;
  concernCategories: Category[];

  category: Category;
  newCategory: string = null;
  newActivityCategory: string = null;
  categoryExists: string = null;
  concernCategoryIsCollapsed = true;
  private subscription$: Subscription[] = [];

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadConcernCategories();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  onCatValueChange(): void {
    this.catValue.emit(this.concernCategory);
  }

  addNewCategory(type: string) {
    let category: Category;
    category = {
      name: this.newCategory,
      type: type
    };
    this.subscription$.push(this.categoryService.addCategory(category).subscribe((r) => {
      this.newCategory = null;
      this.loadConcernCategories();
    }, error => {
      this.categoryExists = error.error;
    }));
  }

  loadConcernCategories(): void {
    this.subscription$.push(this.categoryService.getCategories(this.categoryType).subscribe(cat => {
      this.concernCategories = cat;
    }));
  }

  selectConcernCat(cat: Category) {
    this.concernCategory = cat.name;
    this.onCatValueChange();
  }

}
