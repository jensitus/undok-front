import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CategoryTypes} from '../../model/category-types';
import {Subscription} from 'rxjs';
import {Category} from '../../model/category';
import {CategoryService} from '../../service/category.service';
import {CommonService} from '../../../common/services/common.service';
import {Label} from '../../model/label';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit, OnDestroy {

  @Input() categoryType: CategoryTypes;
  @Input() label: Label;
  private subscription$: Subscription[] = [];
  categoryExists: string = null;
  categoryIsCollapsed = true;
  newCategory: string = null;

  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  addNewCategory(type: string) {
    let category: Category;
    category = {
      name: this.newCategory,
      type: type
    };
    this.subscription$.push(this.categoryService.addCategory(category).subscribe(r => {
      this.newCategory = null;
      this.commonService.setReloadSubject(true);
    }, error => {
      this.categoryExists = error.error;
    }));
  }

}
