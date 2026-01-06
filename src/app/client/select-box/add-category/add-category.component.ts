import { Component, input, output, inject, signal, computed } from '@angular/core';
import { CategoryTypes } from '../../model/category-types';
import { Category } from '../../model/category';
import { CategoryService } from '../../service/category.service';
import { CommonService } from '../../../common/services/common.service';
import { Label } from '../../model/label';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AlertModule } from '../../../admin-template/layout/components/alert/alert.module';
import { AlertService } from '../../../admin-template/layout/components/alert/services/alert.service';

export enum Crud {
  CREATE,
  READ,
  UPDATE,
  DELETE
}

@Component({
  selector: 'app-add-category',
  standalone: true,
  templateUrl: './add-category.component.html',
  imports: [
    NgbCollapse,
    FormsModule,
    AlertModule
  ],
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {
  // Services injected using inject()
  private readonly categoryService = inject(CategoryService);
  private readonly commonService = inject(CommonService);
  private readonly alertService = inject(AlertService);

  // Signal-based inputs
  readonly categoryType = input.required<CategoryTypes>();
  readonly label = input<Label | undefined>(undefined);
  readonly crud = input<Crud>(Crud.CREATE);
  readonly stringLabel = input<string | undefined>(undefined);

  // Signal-based outputs
  readonly submitted = output<boolean>();
  readonly error = output<string>();

  // Component state as signals
  readonly categoryExists = signal<string | null>(null);
  readonly categoryIsCollapsed = signal(true);
  readonly newCategory = signal<string>('');
  readonly isSubmitting = signal(false);

  // Computed signal to check if form is valid
  readonly isFormValid = computed(() => {
    const category = this.newCategory().trim();
    return category.length > 0 && !this.isSubmitting();
  });

  // Computed signal for display label
  readonly displayLabel = computed(() => {
    const labelValue = this.label();
    const stringLabelValue = this.stringLabel();

    if (labelValue) {
      return Label[labelValue];
    } else if (stringLabelValue) {
      return Label[stringLabelValue];
    }
    return '';
  });

  // Expose Label enum for template
  protected readonly Label = Label;

  addNewCategory(type: string): void {
    const categoryName = this.newCategory().trim();

    if (!categoryName) {
      return;
    }

    if (this.isSubmitting()) {
      return; // Prevent double submission
    }

    const category: Category = {
      name: categoryName,
      type: type
    };

    this.isSubmitting.set(true);
    this.categoryExists.set(null);

    this.categoryService.addCategory(category).subscribe({
      next: () => {
        this.newCategory.set('');
        this.categoryIsCollapsed.set(true);
        this.commonService.setReloadSubject(true);
        this.submitted.emit(true);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        const errorMessage = err?.error?.text || 'Failed to add category';
        this.categoryExists.set(errorMessage);
        this.error.emit(errorMessage);
        this.isSubmitting.set(false);
      }
    });
  }

  toggleCollapse(): void {
    this.categoryIsCollapsed.update(collapsed => !collapsed);
  }
}
