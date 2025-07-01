import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CategoryService} from '../service/category.service';
import {CategoryTypes} from '../model/category-types';
import {Category} from '../model/category';
import {Label} from '../model/label';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';

@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.css']
})
export class EditCategoriesComponent implements OnInit, OnDestroy {

  constructor(
    private categoryService: CategoryService,
    private alertService: AlertService
  ) {
  }

  private subscription$: Subscription[] = [];
  categories: Category[];
  catMap = new Map<string, Category[]>();

  protected readonly CategoryTypes = CategoryTypes;
  protected readonly Label = Label;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.subscription$.push(
      this.categoryService.getAllCategories().subscribe({
        next: result => {
          this.categories = result;
          this.sortCategories();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  sortCategories() {
    let catType: keyof typeof CategoryTypes;
    // tslint:disable-next-line:forin
    for (catType in CategoryTypes) {
      const catArray: Category[] = [];
      const value = CategoryTypes[catType];
      this.categories.forEach((c) => {
        if (c.type === value) {
          catArray.push(c);
        }
        console.log(c);
      });
        this.catMap.set(catType, catArray);
    }
  }

  reload() {
    this.getCategories();
    this.alertService.success('Category successfully added');
  }

  showError(event) {
    this.alertService.error(event);
  }
}
