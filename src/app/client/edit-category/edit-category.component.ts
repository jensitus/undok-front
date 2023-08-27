import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from '../service/category.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit, OnDestroy {

  @Input() categoryId: string;
  @Input() categoryName: string;
  private subscription$: Subscription[] = [];
  update = false;
  errorMessage: string = null;

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  editCategory() {
    this.subscription$.push(
      this.categoryService.updateCategory(this.categoryId, this.categoryName).subscribe({
        next: (result) => {
          this.updateCategory();
        }, error: (error) => {
          this.errorMessage = error.error.text;
        }
      })
    );
  }

  updateCategory() {
    this.update = !this.update;
    this.setErrorMessageToNull();
  }

  setErrorMessageToNull() {
    this.errorMessage = null;
  }

}
