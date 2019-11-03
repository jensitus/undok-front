import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertService} from './services/alert.service';
import {AlertComponent} from './alert.component';



@NgModule({
  declarations: [
    AlertComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent
  ],
  providers: [
    AlertService
  ]
})
export class AlertModule { }
