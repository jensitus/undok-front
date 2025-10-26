import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
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
export class EditCategoriesComponent implements OnInit {

  private categoryService = inject(CategoryService);
  private alertService = inject(AlertService);

  // Signals for state management
  categories = signal<Category[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  private subscription$: Subscription[] = [];
  // Computed signal for categorized map
  catMap = computed(() => {
    const map = new Map<string, Category[]>();
    const cats = this.categories();

    let catType: keyof typeof CategoryTypes;
    // tslint:disable-next-line:forin
    for (catType in CategoryTypes) {
      const catArray: Category[] = [];
      const value = CategoryTypes[catType];

      cats.forEach((c) => {
        if (c.type === value) {
          catArray.push(c);
        }
      });

      map.set(catType, catArray);
    }

    return map;
  });

  protected readonly CategoryTypes = CategoryTypes;
  protected readonly Label = Label;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.loading.set(true);
    this.error.set(null);

    this.categoryService.getAllCategories().subscribe({
      next: (result) => {
        this.categories.set(result);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load categories');
        this.loading.set(false);
        this.alertService.error('Failed to load categories');
        console.error('Error loading categories:', err);
      }
    });
  }

/*  sortCategories() {
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
  }*/

  reload() {
    this.getCategories();
    this.alertService.success('Category successfully added');
  }

  showError(event) {
    this.alertService.error(event);
  }

  // Helper method to get categories by type
  getCategoriesByType(type: string): Category[] {
    return this.catMap().get(type) || [];
  }

  // Helper method for template iteration
  getCategoryTypes(): string[] {
    return Object.keys(CategoryTypes);
  }

}
