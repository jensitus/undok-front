import { Component, computed, inject, signal, effect } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { CategoryTypes } from '../model/category-types';
import { Category } from '../model/category';
import { Label } from '../model/label';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import { AddCategoryComponent } from '../select-box/add-category/add-category.component';
import { EditCategoryComponent } from '../edit-category/edit-category.component';

@Component({
  selector: 'app-edit-categories',
  standalone: true,
  templateUrl: './edit-categories.component.html',
  imports: [
    AddCategoryComponent,
    EditCategoryComponent
  ],
  styleUrls: ['./edit-categories.component.css']
})
export class EditCategoriesComponent {
  // Services injected using inject()
  private readonly categoryService = inject(CategoryService);
  private readonly alertService = inject(AlertService);

  // Signals for state management
  readonly categories = signal<Category[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Computed signal for categorized map
  readonly catMap = computed(() => {
    const map = new Map<string, Category[]>();
    const cats = this.categories();

    // Initialize map with all category types
    Object.keys(CategoryTypes).forEach((catType) => {
      const categoryArray: Category[] = [];
      const typeValue = CategoryTypes[catType as keyof typeof CategoryTypes];

      // Filter categories by type
      cats.forEach((category) => {
        if (category.type === typeValue) {
          categoryArray.push(category);
        }
      });

      map.set(catType, categoryArray);
    });

    return map;
  });

  // Computed signal for category types array (for template iteration)
  readonly categoryTypes = computed(() => Object.keys(CategoryTypes));

  // Expose constants for template
  protected readonly CategoryTypes = CategoryTypes;
  protected readonly Label = Label;

  constructor() {
    // Load categories on component initialization
    effect(() => {
      this.getCategories();
    }, { allowSignalWrites: true });
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
        const errorMessage = 'Failed to load categories';
        this.error.set(errorMessage);
        this.loading.set(false);
        this.alertService.error(errorMessage);
        console.error('Error loading categories:', err);
      }
    });
  }

  reload(newCategory: Category): void {
    // Add the new category to the existing categories signal
    this.categories.update(currentCategories => [...currentCategories, newCategory]);
    this.alertService.success('Category successfully added');
  }

  showError(errorMessage: string): void {
    this.alertService.error(errorMessage);
  }

  // Helper method to get categories by type (used in template)
  getCategoriesByType(type: string): Category[] {
    return this.catMap().get(type) || [];
  }
}
