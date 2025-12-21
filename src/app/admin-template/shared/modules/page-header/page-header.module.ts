import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PageHeaderComponent } from './page-header.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [CommonModule, RouterModule, FontAwesomeModule, PageHeaderComponent],
    declarations: [],
    exports: [PageHeaderComponent]
})
export class PageHeaderModule {}
