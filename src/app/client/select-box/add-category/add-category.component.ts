import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CategoryTypes} from '../../model/category-types';
import {Subscription} from 'rxjs';
import {Category} from '../../model/category';
import {CategoryService} from '../../service/category.service';
import {CommonService} from '../../../common/services/common.service';
import {Label} from '../../model/label';
import {NgbCollapse} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

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
    NgIf
  ],
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit, OnDestroy {

  @Input() categoryType: CategoryTypes;
  @Input() label: Label;
  @Input() crud: Crud | undefined;
  @Input() stringLabel: string;
  @Output() submitted = new EventEmitter<boolean>();
  private subscription$: Subscription[] = [];
  categoryExists: string = null;
  categoryIsCollapsed = true;
  newCategory: string = null;

  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    if (this.crud === undefined) {
      this.crud = Crud.CREATE;
    }
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  addNewCategory(type: string) {
    let category: Category;
    category = {
      name: this.newCategory,
      type: type
    };
    this.subscription$.push(
      this.categoryService.addCategory(category).subscribe({
        next: (r) => {
          this.newCategory = null;
          this.categoryIsCollapsed = true;
          this.commonService.setReloadSubject(true);
          this.submitted.emit(true);
        },
        error: (err) => {
          this.categoryExists = err.error;
        }
      })
    );
  }

}
