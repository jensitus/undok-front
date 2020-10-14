import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {HomeComponent} from './common/home/home.component';
import {RouterModule, Routes} from '@angular/router';
import {UserService} from './auth/services/user.service';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from './auth/services/authentication.service';
import {JwtInterceptor} from './auth/helpers/jwt.interceptor';
import {ErrorInterceptor} from './common/helper/error.interceptor';
import {AuthGuard} from './auth/guards/auth.guard';
import {NavbarComponent} from './common/navbar/navbar.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {ListTodoComponent} from './todo-item/list-todo/list-todo.component';
// import {ItemsComponent} from './todo-item/items/items.component';
import {ShowTodoComponent} from './todo-item/show-todo/show-todo.component';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {DiaryComponent} from './diary/diary/diary.component';
import {DiaryListComponent} from './diary/diary-list/diary-list.component';
import {AddDiaryComponent} from './diary/add-diary/add-diary.component';
import {EditDiaryComponent} from './diary/edit-diary/edit-diary.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {UserComponent} from './auth/user/user.component';
import {EditUserComponent} from './auth/edit-user/edit-user.component';

import {OrderModule} from 'ngx-order-pipe';

import {TodoComponent} from './todo-item/todo/todo.component';
import {TaskListComponent} from './process/task-list/task-list.component';
import {ProcessMigrationComponent} from './common/process-migration/process-migration.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LayoutModule} from './admin-template/layout/layout.module';
import {ConfirmAccountComponent} from './auth/confirm-account/confirm-account.component';
import {AlertModule} from './admin-template/layout/components/alert/alert.module';
import {ChangePasswordComponent} from './auth/change-password/change-password.component';
import {PageHeaderModule} from './admin-template/shared/modules';
import {UploadComponent} from './common/upload/upload.component';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {FileUploadModule} from 'ng2-file-upload';
import { FilelistComponent } from './common/upload/filelist/filelist.component';
import { TheaterComponent } from './cinephilia/theater/theater.component';
import { MoviesComponent } from './cinephilia/movies/movies.component';
import { TheatersComponent } from './cinephilia/theaters/theaters.component';

const app_routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  // { path: '', loadChildren: () => import('./admin-template/layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot', component: ForgotPasswordComponent},
  {path: 'auth/reset_password/:token/edit', component: ResetPasswordComponent},
  {path: 'auth/:token/confirm', component: ConfirmAccountComponent},
  {path: 'upload', component: UploadComponent},
  {path: 'filelist', component: FilelistComponent},
  {path: 'cinephilia/theaters', component: TheatersComponent },
  {path: 'cinephilia/theaters/:id/movies', component: TheaterComponent  }
/*
  {path: 'todos', component: TodoComponent},
  {path: 'todos/:id', component: ShowTodoComponent},
  {path: 'diaries', component: DiaryListComponent},
  {path: 'diaries/:id', component: DiaryComponent},
  {path: 'diaries/:id/edit', component: EditDiaryComponent},
  {path: 'tasks/:formKey/:taskId', component: TaskComponent},
  {path: 'tasks/list', component: TaskListComponent},
  {path: 'migrate/process', component: ProcessMigrationComponent}*/
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ListTodoComponent,
    // ItemsComponent,
    ShowTodoComponent,
    DiaryComponent,
    DiaryListComponent,
    AddDiaryComponent,
    EditDiaryComponent,
    UserComponent,
    EditUserComponent,
    TodoComponent,
    TaskListComponent,
    ProcessMigrationComponent,
    ConfirmAccountComponent,
    ChangePasswordComponent,
    UploadComponent,
    FilelistComponent,
    TheaterComponent,
    MoviesComponent,
    TheatersComponent,
  ],
  imports: [
    BrowserModule,
    OrderModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(app_routes, {enableTracing: true}),
    HttpClientModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    NgbModule,
    LayoutModule,
    AlertModule,
    PageHeaderModule,
    FileUploadModule
  ],
  providers: [
    AuthGuard,
    UserService,
    AuthenticationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
