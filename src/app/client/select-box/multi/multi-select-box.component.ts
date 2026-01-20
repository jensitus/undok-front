import {Component, computed, DestroyRef, effect, inject, input, OnInit, output, signal} from '@angular/core';
import {DropdownItem} from '../../model/dropdown-item';
import {IDropdownSettings, NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {CategoryService} from '../../service/category.service';
import {Category} from '../../model/category';
import {CategoryTypes} from '../../model/category-types';
import {CommonService} from '../../../common/services/common.service';
import {Label} from '../../model/label';
import {NgbProgressbar} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {AddCategoryComponent} from '../add-category/add-category.component';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-multi',
  standalone: true,
  templateUrl: './multi-select-box.component.html',
  imports: [
    NgbProgressbar,
    NgMultiSelectDropDownModule,
    FormsModule,
    AddCategoryComponent
  ],
  styleUrls: ['./multi-select-box.component.css']
})
export class MultiSelectBoxComponent implements OnInit {
  // Services
  private categoryService = inject(CategoryService);
  private commonService = inject(CommonService);
  private destroyRef = inject(DestroyRef);

  // Inputs using modern input() API
  selectedCategories = input<Category[]>();
  categoryType = input.required<CategoryTypes>();
  label = input<Label>();

  // Outputs using modern output() API
  categoryValue = output<DropdownItem[]>();
  deSelectedEmit = output<DropdownItem[]>();

  // Signals for reactive state
  concernCategories = signal<Category[]>([]);
  dropdownList = signal<DropdownItem[]>([]);
  selectedItems = signal<DropdownItem[]>([]);
  deSelectedItems = signal<DropdownItem[]>([]);
  waitForCategories = signal<boolean>(false);

  // Dropdown settings (non-reactive config)
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'itemId',
    textField: 'itemText',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true
  };

  // Computed signal to derive dropdown items from categories
  private dropdownItems = computed(() => {
    const categories = this.concernCategories();
    return categories.map(c => ({
      itemId: c.id,
      itemText: c.name
    } as DropdownItem));
  });

  // Computed signal to derive selected items from input
  private initialSelectedItems = computed(() => {
    const selected = this.selectedCategories();
    if (!selected) { return []; }
    return selected.map(cat => ({
      itemId: cat.id,
      itemText: cat.name
    } as DropdownItem));
  });

  // Effect to sync computed values to writable signals
  constructor() {
    // Effect to update dropdown list when categories change
    effect(() => {
      const items = this.dropdownItems();
      this.dropdownList.set(items);
    });

    // Effect to update selected items when input changes
    effect(() => {
      const items = this.initialSelectedItems();
      if (items.length > 0) {
        this.selectedItems.set(items);
      }
    });

    // Effect to listen to reload signal
    effect(() => {
      if (this.commonService.reload()) {
        this.loadCategoriesByCategoryType();
      }
    });
  }

  ngOnInit(): void {
    this.loadCategoriesByCategoryType();
    console.log(this.label());
  }

  loadCategoriesByCategoryType(): void {
    this.waitForCategories.set(false);

    this.categoryService.getCategories(this.categoryType())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this.concernCategories.set(categories);
          this.waitForCategories.set(true);
        },
        error: (err) => {
          console.error('Error loading categories:', err);
          this.waitForCategories.set(true);
        }
      });
  }

  onItemSelect(item: DropdownItem): void {
    // Remove from deselected items if it was there
    const currentDeselected = this.deSelectedItems();
    const updatedDeselected = currentDeselected.filter(
      deSelectedItem => deSelectedItem.itemId !== item.itemId
    );
    this.deSelectedItems.set(updatedDeselected);

    // Emit the current selected items
    this.categoryValue.emit(this.selectedItems());
    this.deSelectedEmit.emit(this.deSelectedItems());
  }

  onSelectAll(items: any): void {
    // Implementation if needed
  }

  deSelect(event: DropdownItem): void {
    // Add to deselected items
    const currentDeselected = this.deSelectedItems();
    this.deSelectedItems.set([...currentDeselected, {
      itemId: event.itemId,
      itemText: event.itemText
    }]);

    this.deSelectedEmit.emit(this.deSelectedItems());
  }
}
