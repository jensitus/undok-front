import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {HomeComponent} from './common/home/home.component';
import {RouterModule, Routes} from '@angular/router';
import {UserService} from './auth/services/user.service';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AlertService} from './common/alert/services/alert.service';
import {AlertComponent} from './common/alert/alert.component';
import {AuthenticationService} from './auth/services/authentication.service';
import {JwtInterceptor} from './auth/helpers/jwt.interceptor';
import {ErrorInterceptor} from './common/helper/error.interceptor';
import {AuthGuard} from './auth/guards/auth.guard';
import {NavbarComponent} from './common/navbar/navbar.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {ListTodoComponent} from './todo-item/list-todo/list-todo.component';
import {ItemsComponent} from './todo-item/items/items.component';
import {ShowTodoComponent} from './todo-item/show-todo/show-todo.component';
import {AddTodoComponent} from './todo-item/add-todo/add-todo.component';
import {EditTodoComponent} from './todo-item/edit-todo/edit-todo.component';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {DiaryComponent} from './diary/diary/diary.component';
import {DiaryListComponent} from './diary/diary-list/diary-list.component';
import {AddDiaryComponent} from './diary/add-diary/add-diary.component';
import {EditDiaryComponent} from './diary/edit-diary/edit-diary.component';
import {MenubarModule} from 'primeng/menubar';
import {ContextMenuModule} from 'primeng/contextmenu';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenuModule} from 'primeng/menu';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {FileUploadModule} from 'primeng/fileupload';
import {UserComponent} from './auth/user/user.component';
import {EditUserComponent} from './auth/edit-user/edit-user.component';
import {MessageService} from 'primeng/api';
import {SidebarModule} from 'primeng/sidebar';
import {OrderModule} from 'ngx-order-pipe';
import { DescriptionComponent } from './todo-item/description/add/description.component';
import { EditDescriptionComponent } from './todo-item/description/edit/edit-description.component';
import {DialogModule} from 'primeng/dialog';
import {AccordionModule} from 'primeng/accordion';
import {PanelModule} from 'primeng/panel';
import { TodoComponent } from './todo-item/todo/todo.component';

const app_routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot', component: ForgotPasswordComponent},
  {path: 'auth/reset_password/:token/edit', component: ResetPasswordComponent},
  {path: 'users/:username', component: UserComponent},
  {path: 'users/:username/edit', component: EditUserComponent},
  {path: 'todos', component: TodoComponent},
  {path: 'todos/:id', component: ShowTodoComponent},
  {path: 'diaries', component: DiaryListComponent},
  {path: 'diaries/:id', component: DiaryComponent},
  {path: 'diaries/:id/edit', component: EditDiaryComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    NavbarComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ListTodoComponent,
    ItemsComponent,
    ShowTodoComponent,
    AddTodoComponent,
    EditTodoComponent,
    DiaryComponent,
    DiaryListComponent,
    AddDiaryComponent,
    EditDiaryComponent,
    UserComponent,
    EditUserComponent,
    DescriptionComponent,
    EditDescriptionComponent,
    TodoComponent
  ],
  imports: [
    BrowserModule,
    OrderModule,
    FormsModule,
    MenubarModule,
    ContextMenuModule,
    ButtonModule,
    SplitButtonModule,
    MenuModule,
    BrowserAnimationsModule,
    InputTextModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    InputTextareaModule,
    FileUploadModule,
    SidebarModule,
    RouterModule.forRoot(app_routes, {enableTracing: true}),
    HttpClientModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    DialogModule,
    AccordionModule,
    PanelModule
  ],
  providers: [
    AuthGuard,
    UserService,
    AlertService,
    AuthenticationService,
    MessageService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
