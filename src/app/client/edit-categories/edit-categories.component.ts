import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CategoryService} from '../service/category.service';
import {CategoryTypes} from '../model/category-types';
import {Category} from '../model/category';

@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.css']
})
export class EditCategoriesComponent implements OnInit, OnDestroy {

  private subscription$: Subscription[] = [];
  categories: Category[];
  catMap = new Map<string, Category[]>();

  protected readonly CategoryTypes = CategoryTypes;

  constructor(
    private categoryService: CategoryService
  ) {
  }

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
      });
      if (value === 'ACTIVITY') {
        this.catMap.set('Aktivitätskategorie', catArray);
      } else if (value === 'LEGAL') {
        this.catMap.set('Rechtsschutzkategorie', catArray);
      } else {
        this.catMap.set(value, catArray);
      }
    }
  }

  reload() {
    this.getCategories();
  }
}
