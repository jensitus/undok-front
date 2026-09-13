import {Component, effect, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Category} from '../../model/category';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';
import {CategoryService} from '../../service/category.service';
import {CategoryTypes} from '../../model/category-types';
import {CommonService} from '../../../common/services/common.service';
import {Label} from '../../model/label';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-select-box',
  standalone: true,
  templateUrl: './select-box.component.html',
  imports: [
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./select-box.component.css']
})
export class SelectBoxComponent implements OnInit, OnDestroy {

  @Input() categoryType: CategoryTypes;
  @Input() cat_model: any | undefined;
  @Input() label: Label;
  categoryName: string;

  @Output()
  catValue = new EventEmitter<string>();

  /**
   * Emits the whole selected category, so callers that persist via join_category
   * get the id rather than just the name. Bound only where a category type has
   * already been migrated off its plain string column.
   */
  @Output()
  catObject = new EventEmitter<Category>();

  faBars = faBars;
  categoriesToSelect: Category[];

  /**
   * Option values are whole Category objects, but a preselected category usually comes from
   * a different HTTP response than categoriesToSelect, so identity comparison fails. Match on
   * id when both sides are objects; fall back to === for the boxes still bound to a plain
   * string column (gender, target group, ...).
   */
  compareCategories = (a: any, b: any): boolean => {
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      return a.id === b.id;
    }
    return a === b;
  };

  category: Category;
  private subscription$: Subscription[] = [];

  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService
  ) {
    // Effect to watch for reload signal changes
    effect(() => {
      if (this.commonService.reload()) {
        this.loadCategoriesByCategoryType();
      }
    });
  }

  ngOnInit(): void {
    this.loadCategoriesByCategoryType();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  onCategoryValueChange(): void {
    this.catValue.emit(this.categoryName);
    this.catObject.emit(this.cat_model);
  }

  loadCategoriesByCategoryType(): void {
    this.subscription$.push(
      this.categoryService.getCategories(this.categoryType).subscribe(cat => {
        this.categoriesToSelect = cat;
      })
    );
  }

  /**
   * Also runs when the clear button empties the box: ng-select nulls the model before it emits
   * the change event, so cat_model is null here and both outputs deselect.
   */
  selectCategory() {
    this.categoryName = this.cat_model?.name ?? null;
    this.onCategoryValueChange();
  }

}
