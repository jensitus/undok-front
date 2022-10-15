import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Category} from '../model/category';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';
import {CategoryService} from '../service/category.service';
import {CategoryTypes} from '../model/category-types';
import {IDropdownSettings} from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.css']
})
export class SelectBoxComponent implements OnInit, OnDestroy {

  dropdownList = [];
  dropdownList_1 = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  // CONCERN_CATEGORY = 'concernCategory';
  // ACTIVITY_CATEGORY = 'activityCategory';

  @Input() multiSelect = false;
  @Input() categoryType: CategoryTypes;
  @Input() cat_model: any;
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
    this.loadCategoriesByCategoryType();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  getMultiSelectBoxItems() {
      this.concernCategories?.forEach((c) => {
        console.log('c', c);
        this.dropdownList_1.push({item_id: c.id, item_text: c.name});
      });

      this.dropdownList = [
        {item_id: 1, item_text: 'Mumbai'},
        {item_id: 2, item_text: 'Bangaluru'},
        {item_id: 3, item_text: 'Pune'},
        {item_id: 4, item_text: 'Navsari'},
        {item_id: 5, item_text: 'New Delhi'}
      ];
    console.log('dropdownList', this.dropdownList);
    console.log('dropdownList_1', this.dropdownList_1);
      this.selectedItems = [
        this.dropdownList_1[0], this.dropdownList_1[1]
      ];
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };

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
      this.loadCategoriesByCategoryType();
    }, error => {
      this.categoryExists = error.error;
    }));
  }

  loadCategoriesByCategoryType(): void {
    this.subscription$.push(this.categoryService.getCategories(this.categoryType).subscribe(cat => {
      this.concernCategories = cat;
      if (this.multiSelect) {
        this.getMultiSelectBoxItems();
      }
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
