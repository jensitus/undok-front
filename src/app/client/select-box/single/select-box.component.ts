import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Category} from '../../model/category';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';
import {CategoryService} from '../../service/category.service';
import {CategoryTypes} from '../../model/category-types';
import {CommonService} from '../../../common/services/common.service';


@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.css']
})
export class SelectBoxComponent implements OnInit, OnDestroy {

  @Input() categoryType: CategoryTypes;
  @Input() cat_model: any;
  activityCategory: string;
  concernCategory: string;

  @Output()
  catValue = new EventEmitter<string>();

  faBars = faBars;
  concernCategories: Category[];

  category: Category;
  private subscription$: Subscription[] = [];

  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getReloadSubject();
    this.loadCategoriesByCategoryType();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  getReloadSubject() {
    this.subscription$.push(this.commonService.reloadSubject.subscribe(reload => {
      if (reload === true) {
        this.loadCategoriesByCategoryType();
      }
    }));
  }

  onCatValueChange(): void {
    this.catValue.emit(this.concernCategory);
  }

  loadCategoriesByCategoryType(): void {
    this.subscription$.push(this.categoryService.getCategories(this.categoryType).subscribe(cat => {
      this.concernCategories = cat;
    }));
  }

  selectConcernCat(cat: Category) {
    this.concernCategory = cat.name;
    this.onCatValueChange();
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

}
