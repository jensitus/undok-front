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
import {AlertModule} from './components/alert/alert.module';
import {AuthGuard} from '../../auth/guards/auth.guard';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from '../../auth/helpers/jwt.interceptor';
import {ErrorInterceptor} from '../../common/helper/error.interceptor';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        NgbDropdownModule,
        TaskModule,
        ReactiveFormsModule,
        FormsModule,
        AlertModule,
        FontAwesomeModule
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
    ],
    exports: [
        HeaderComponent
    ],
    providers: [
        AuthGuard,
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
    ]
})
export class LayoutModule {}
