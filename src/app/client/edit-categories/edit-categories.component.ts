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

  protected readonly CategoryTypes = CategoryTypes;

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.subscription$.push(
      this.categoryService.getAllCategories().subscribe({
        next: result => {
          this.categories = result;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }
}
