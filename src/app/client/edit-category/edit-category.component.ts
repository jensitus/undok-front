import { Component, input, inject, signal, effect } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  templateUrl: './edit-category.component.html',
  imports: [FormsModule],
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent {
  // Service injected using inject()
  private readonly categoryService = inject(CategoryService);

  // Signal-based inputs
  readonly categoryId = input.required<string>();
  readonly initialCategoryName = input.required<string>({ alias: 'categoryName' });

  // Component state as signals
  readonly categoryName = signal<string>('');
  readonly isEditMode = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  constructor() {
    // Sync categoryName with input changes
    effect(() => {
      this.categoryName.set(this.initialCategoryName());
    });
  }

  editCategory(): void {
    const categoryId = this.categoryId();
    const categoryName = this.categoryName().trim();

    if (!categoryName) {
      this.errorMessage.set('Category name cannot be empty');
      return;
    }

    if (this.isSubmitting()) {
      return; // Prevent double submission
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.categoryService.updateCategory(categoryId, categoryName).subscribe({
      next: () => {
        this.isEditMode.set(false);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        const error = err?.error?.text || 'Failed to update category';
        this.errorMessage.set(error);
        this.isSubmitting.set(false);
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode.update(mode => !mode);
    this.errorMessage.set(null);

    // Reset to original name if canceling
    if (!this.isEditMode()) {
      this.categoryName.set(this.initialCategoryName());
    }
  }

  cancelEdit(): void {
    this.categoryName.set(this.initialCategoryName());
    this.isEditMode.set(false);
    this.errorMessage.set(null);
  }
}
