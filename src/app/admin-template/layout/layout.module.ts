import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import {TaskComponent} from './components/task/task.component';
import {TodotaskComponent} from './components/task/todotask/todotask.component';
import {ConftodoComponent} from './components/task/conftodo/conftodo.component';
import {FinishTodoComponent} from './components/task/finish-todo/finish-todo.component';
import {TaskModule} from './components/task/task-module/task.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddUserComponent} from '../../common/add-user/add-user.component';
import {SetVariableCheckBoxComponent} from '../../process/set-variable-checkbox/set-variable-check-box.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    NgbDropdownModule,
    TaskModule,
    ReactiveFormsModule,
    FormsModule
  ],
    declarations: [
      LayoutComponent,
      SidebarComponent,
      HeaderComponent,
      TaskComponent,
      TodotaskComponent,
      ConftodoComponent,
      FinishTodoComponent,
      AddUserComponent,
      SetVariableCheckBoxComponent
    ]
})
export class LayoutModule {}
