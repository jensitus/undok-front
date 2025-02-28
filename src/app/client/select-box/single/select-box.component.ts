import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Category} from '../../model/category';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';
import {CategoryService} from '../../service/category.service';
import {CategoryTypes} from '../../model/category-types';
import {CommonService} from '../../../common/services/common.service';
import {Label} from '../../model/label';
import {AddCategoryComponent} from '../add-category/add-category.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';


@Component({
  selector: 'app-select-box',
  standalone: true,
  templateUrl: './select-box.component.html',
  imports: [
    AddCategoryComponent,
    NgSelectModule,
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./select-box.component.css']
})
export class SelectBoxComponent implements OnInit, OnDestroy {

  @Input() categoryType: CategoryTypes;
  @Input() cat_model: any;
  @Input() label: Label;
  categoryName: string;

  @Output()
  catValue = new EventEmitter<string>();

  faBars = faBars;
  categoriesToSelect: Category[];

  category: Category;
  private subscription$: Subscription[] = [];

  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    this.getReloadSubject();
    this.loadCategoriesByCategoryType();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  getReloadSubject() {
    this.subscription$.push(
      this.commonService.reloadSubject.subscribe(reload => {
        if (reload === true) {
          this.loadCategoriesByCategoryType();
        }
      })
    );
  }

  onCategoryValueChange(): void {
    this.catValue.emit(this.categoryName);
  }

  loadCategoriesByCategoryType(): void {
    this.subscription$.push(
      this.categoryService.getCategories(this.categoryType).subscribe(cat => {
        this.categoriesToSelect = cat;
      })
    );
  }

  selectCategory() {
    this.categoryName = this.cat_model.name;
    this.onCategoryValueChange();
  }

}
