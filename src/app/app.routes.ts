import {Routes} from '@angular/router';
import {HomeComponent} from './common/home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthGuard} from './auth/guards/auth.guard';
import {TwoFactorComponent} from './auth/two-factor/two-factor.component';
import {RegisterComponent} from './auth/register/register.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {ConfirmAccountComponent} from './auth/confirm-account/confirm-account.component';
import {UserComponent} from './auth/user/user.component';
import {EditUserComponent} from './auth/edit-user/edit-user.component';
import {ChangePasswordComponent} from './auth/change-password/change-password.component';
import {DashboardComponent} from './admin-template/layout/dashboard/dashboard.component';
import {UserListComponent} from './admin-template/layout/dashboard/components/show-users/user-list/user-list.component';
import {ShowUsersComponent} from './admin-template/layout/dashboard/components/show-users/show-users.component';

export const routes: Routes = [
  {path: 'home', component: HomeComponent, pathMatch: 'full'},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  // { path: '', loadChildren: () => import('./admin-template/layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent},
  {path: 'second-factor', component: TwoFactorComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot', component: ForgotPasswordComponent},
  {path: 'auth/reset_password/:token/edit', component: ResetPasswordComponent},
  {path: 'auth/:token/confirm/:email', component: ConfirmAccountComponent},

  {path: 'dashboard', component: DashboardComponent},
  // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
  {path: 'users/:username', component: UserComponent},
  {path: 'users/:username/edit', component: EditUserComponent},
  {path: 'users/:username/changepw', component: ChangePasswordComponent},
  {path: 'list-users', component: ShowUsersComponent },
  // loadChildren: () => import('./dashboard/components/show-users/create-user.module').then(m => m.CreateUserModule)},
  { path: 'charts', loadChildren: () => import('./admin-template/layout/charts/charts.module').then(m => m.ChartsModule) },
  {path: 'clients', loadChildren: () => import('./client/client.module').then(c => c.ClientModule)}

  // {path: '', redirectTo: 'login', pathMatch: 'full'},
  // {path: '', redirectTo: 'dashboard', canActivate: [AuthGuard]},
  // { path: '', loadChildren: () => import('./admin-template/layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
  // {path: 'second-factor', component: TwoFactorComponent},
  // {path: 'register', component: RegisterComponent},
  // {path: 'forgot', component: ForgotPasswordComponent},
  // {path: 'auth/reset_password/:token/edit', component: ResetPasswordComponent},
  // {path: 'auth/:token/confirm/:email', component: ConfirmAccountComponent},

  // {path: 'clients/employers', component: ShowEmployersComponent},
  // {path: 'clients/csv-download-list', component: BackUpComponent},
  // {path: 'clients/edit-categories', component: EditCategoriesComponent},
  // {path: 'clients/create', component: CreateClientComponent},
  // {path: 'clients/client-list', component: ShowClientsComponent},
  // {path: 'clients/counselings', component: ShowCounselingsComponent},
  // {path: 'clients/:id', component: ShowSingleClientComponent},
  // {path: 'clients/create/employer', component: CreateEmployerComponent},
  // {path: 'clients/employers/:id', component: ShowSingleEmployerComponent},
  // {path: 'clients/:id/create-counseling', component: CreateCounselingComponent},
  // {path: 'clients/:id/edit', component: EditClientComponent},
  // {path: 'clients/:client_id/counselings/:counseling_id', component: ShowCounselingComponent},

  // {
  //   path: 'charts',
  //   component: ChartsComponent
  // },
  //
  // {path: 'list-users', component: ShowUsersComponent},
  //
  // {path: 'users/:username', component: UserComponent},
  // {path: 'users/:username/edit', component: EditUserComponent},
  // {path: 'users/:username/changepw', component: ChangePasswordComponent},
  //
  // {
  //   path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]
  // }

];
