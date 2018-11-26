import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import {UserService} from './auth/services/user.service';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AlertService} from './auth/services/alert.service';
import { AlertComponent } from './auth/directives/alert/alert.component';
import {AuthenticationService} from './auth/services/authentication.service';
import {JwtInterceptor} from './auth/helpers/jwt.interceptor';
import {ErrorInterceptor} from './auth/helpers/error.interceptor';
import {AuthGuard} from './auth/guards/auth.guard';
import { NavbarComponent } from './navbar/navbar.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

const app_routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '',     redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'reset/:token', component: ResetPasswordComponent }
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
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(app_routes, { enableTracing: true }),
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    UserService,
    AlertService,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
