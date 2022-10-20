import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DropdownItem} from '../../model/dropdown-item';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {CategoryService} from '../../service/category.service';
import {Category} from '../../model/category';
import {Subscription} from 'rxjs';
import {CategoryTypes} from '../../model/category-types';

@Component({
  selector: 'app-multi',
  templateUrl: './multi-select-box.component.html',
  styleUrls: ['./multi-select-box.component.css']
})
export class MultiSelectBoxComponent implements OnInit, OnDestroy {

  dropdownList: DropdownItem[] = [];
  dropdownList_1 = [];
  selectedItems: DropdownItem[] = [];
  dropdownSettings: IDropdownSettings = {};
  concernCategories: Category[];
  category: Category;
  private subscription$: Subscription[] = [];
  @Input() categoryType: CategoryTypes;
  @Output() activityCategoryValue = new EventEmitter<DropdownItem[]>();

  constructor(
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'itemId',
      textField: 'itemText',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.loadCategoriesByCategoryType();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  loadCategoriesByCategoryType(): void {
    this.subscription$.push(this.categoryService.getCategories(this.categoryType).subscribe(cat => {
      this.concernCategories = cat;
      this.getMultiSelectBoxItems();
    }));
  }

  getMultiSelectBoxItems() {
    this.concernCategories?.forEach((c) => {
      console.log('c', c);
      const dropdownItem: DropdownItem = {
        itemId: c.id,
        itemText: c.name
      };
      this.dropdownList.push(dropdownItem);
      this.dropdownList_1.push({item_id: c.id, item_text: c.name});
    });

    // this.dropdownList = [
    // {item_id: 1, item_text: 'Mumbai'},
    // {item_id: 2, item_text: 'Bangaluru'},
    // {item_id: 3, item_text: 'Pune'},
    // {item_id: 4, item_text: 'Navsari'},
    // {item_id: 5, item_text: 'New Delhi'}
    // ];
    console.log('dropdownList', this.dropdownList);
    console.log('dropdownList_1', this.dropdownList_1);
    this.selectedItems = [
      this.dropdownList[0], this.dropdownList[1]
    ];
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
    console.log('this.selectedItems', this.selectedItems);
    this.activityCategoryValue.emit(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }

}
