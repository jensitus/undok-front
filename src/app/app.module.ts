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

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {UserComponent} from './auth/user/user.component';
import {EditUserComponent} from './auth/edit-user/edit-user.component';

import {OrderModule} from 'ngx-order-pipe';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LayoutModule} from './admin-template/layout/layout.module';
import {ConfirmAccountComponent} from './auth/confirm-account/confirm-account.component';
import {AlertModule} from './admin-template/layout/components/alert/alert.module';
import {ChangePasswordComponent} from './auth/change-password/change-password.component';
import {PageHeaderModule} from './admin-template/shared/modules';
import {UploadComponent} from './common/upload/upload.component';
import {FileUploadModule} from 'ng2-file-upload';
import { FilelistComponent } from './common/upload/filelist/filelist.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const app_routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  // { path: '', loadChildren: () => import('./admin-template/layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot', component: ForgotPasswordComponent},
  {path: 'auth/reset_password/:token/edit', component: ResetPasswordComponent},
  {path: 'auth/:token/confirm/:email', component: ConfirmAccountComponent},
  {path: 'upload', component: UploadComponent},
  {path: 'filelist', component: FilelistComponent},
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
    UserComponent,
    EditUserComponent,
    ConfirmAccountComponent,
    ChangePasswordComponent,
    UploadComponent,
    FilelistComponent,
  ],
  imports: [
    BrowserModule,
    OrderModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(app_routes, {enableTracing: true}),
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    LayoutModule,
    AlertModule,
    PageHeaderModule,
    FileUploadModule,
    FontAwesomeModule
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
