import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MultiSelectBoxComponent} from '../multi/multi-select-box.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {NgbProgressbar} from '@ng-bootstrap/ng-bootstrap';
import {AddCategoryComponent} from '../add-category/add-category.component';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [MultiSelectBoxComponent],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbProgressbar,
    AddCategoryComponent,
    FormsModule
  ],
  exports: [MultiSelectBoxComponent]
})
export class SelectModule { }
