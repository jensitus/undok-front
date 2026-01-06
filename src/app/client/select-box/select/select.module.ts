import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MultiSelectBoxComponent} from '../multi/multi-select-box.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap/progressbar';
import {AddCategoryComponent} from '../add-category/add-category.component';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbProgressbarModule,
    AddCategoryComponent,
    FormsModule,
    MultiSelectBoxComponent
  ],
  exports: [MultiSelectBoxComponent]
})
export class SelectModule { }
