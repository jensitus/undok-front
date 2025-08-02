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
import {AlertModule} from '../../../admin-template/layout/components/alert/alert.module';
import {AlertService} from '../../../admin-template/layout/components/alert/services/alert.service';

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
    NgIf,
    AlertModule
  ],
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit, OnDestroy {

  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService,
    private alertService: AlertService
  ) {
  }

  @Input() categoryType: CategoryTypes;
  @Input() label: Label;
  @Input() crud: Crud | undefined;
  @Input() stringLabel: string;
  @Output() submitted = new EventEmitter<boolean>();
  @Output() error = new EventEmitter<string>();
  private subscription$: Subscription[] = [];
  categoryExists: string = null;
  categoryIsCollapsed = true;
  newCategory: string = null;

  protected readonly Label = Label;

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
          this.categoryExists = err.error.text;
          this.error.emit(err.error.text);
        }
      })
    );
  }
}
