import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DropdownItem} from '../../model/dropdown-item';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {CategoryService} from '../../service/category.service';
import {Category} from '../../model/category';
import {Subscription} from 'rxjs';
import {CategoryTypes} from '../../model/category-types';
import {CommonService} from '../../../common/services/common.service';
import {Label} from '../../model/label';

@Component({
  selector: 'app-multi',
  templateUrl: './multi-select-box.component.html',
  styleUrls: ['./multi-select-box.component.css']
})
export class MultiSelectBoxComponent implements OnInit, OnDestroy {

  dropdownList: DropdownItem[] = [];
  dropdownList_1 = [];
  selectedItems: DropdownItem[] = [];
  deSelectedItems: DropdownItem[] = [];
  dropdownSettings: IDropdownSettings = {};
  concernCategories: Category[];
  category: Category;
  private subscription$: Subscription[] = [];
  waitForCategories = false;
  @Input() selectedCategories: Category[];
  @Input() categoryType: CategoryTypes;
  @Input() label: Label;
  @Output() categoryValue = new EventEmitter<DropdownItem[]>();
  @Output() deSelectedEmit = new EventEmitter<DropdownItem[]>();

  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'itemId',
      textField: 'itemText',
      // selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
    this.loadCategoriesByCategoryType();
    this.getReloadSubject();
    console.log(this.label);
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  loadCategoriesByCategoryType(): void {
    this.waitForCategories = false;
    this.subscription$.push(this.categoryService.getCategories(this.categoryType).subscribe(cat => {
      this.concernCategories = cat;
      this.getMultiSelectBoxItems();
    }));
  }

  getMultiSelectBoxItems() {
    this.dropdownList = [];
    this.concernCategories?.forEach((c) => {
      const dropdownItem: DropdownItem = {
        itemId: c.id,
        itemText: c.name
      };
      this.dropdownList.push(dropdownItem);
      this.dropdownList_1.push({item_id: c.id, item_text: c.name});
    });
    this.selectedCategories?.forEach((cat) => {
      const dropdown: DropdownItem = {
        itemId: cat.id,
        itemText: cat.name
      };
      this.selectedItems.push(dropdown);
    });
    this.waitForCategories = true;
  }

  onItemSelect(item: DropdownItem) {
    this.categoryValue.emit(this.selectedItems);
    this.deSelectedItems = this.deSelectedItems.filter(deSelectedItem => deSelectedItem.itemId !== item.itemId);
    this.deSelectedEmit.emit(this.deSelectedItems);
  }

  onSelectAll(items: any) {
  }

  deSelect(event: DropdownItem) {
    this.deSelectedItems.push({itemId: event.itemId, itemText: event.itemText});
    this.deSelectedEmit.emit(this.deSelectedItems);
  }

  getReloadSubject() {
    this.subscription$.push(this.commonService.reloadSubject.subscribe(result => {
      if (result === true) {
        this.loadCategoriesByCategoryType();
      }
    }));
  }

}
