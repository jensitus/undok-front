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
import {ShowSingleTaskComponent} from './client/components/tasks/show-single-task/show-single-task.component';
import {ShowCounselingComponent} from './client/show-counseling/show-counseling.component';
import {EditClientComponent} from './client/edit-client/edit-client.component';
import {CreateCounselingComponent} from './client/create-counseling/create-counseling.component';
import {ShowSingleEmployerComponent} from './client/show-single-employer/show-single-employer.component';
import {CreateEmployerComponent} from './client/create-empoyer/create-employer.component';
import {ShowSingleClientComponent} from './client/show-single-client/show-single-client.component';
import {ReportComponent} from './client/report/report.component';
import {ShowCounselingsComponent} from './client/show-counselings/show-counselings.component';
import {ShowClientsComponent} from './client/show-clients/show-clients.component';
import {CreateClientComponent} from './client/create-client/create-client.component';
import {EditCategoriesComponent} from './client/edit-categories/edit-categories.component';
import {BackUpComponent} from './client/back-up/back-up.component';
import {SearchComponent} from './client/search/search.component';
import {ShowEmployersComponent} from './client/show-employers/show-employers.component';

export const routes: Routes = [
  {path: 'home', component: HomeComponent, pathMatch: 'full'},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'second-factor', component: TwoFactorComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot', component: ForgotPasswordComponent},
  {path: 'auth/reset_password/:token/edit', component: ResetPasswordComponent},
  {path: 'auth/:token/confirm/:email', component: ConfirmAccountComponent},

  {path: 'dashboard', component: DashboardComponent},
  {path: 'users/:username', component: UserComponent},
  {path: 'users/:username/edit', component: EditUserComponent},
  {path: 'users/:username/changepw', component: ChangePasswordComponent},
  {path: 'list-users', component: ShowUsersComponent },

  /* new client routes: */
  {path: 'clients/employers', component: ShowEmployersComponent},
  {path: 'clients/search', component: SearchComponent},
  {path: 'clients/csv-download-list', component: BackUpComponent},
  {path: 'clients/edit-categories', component: EditCategoriesComponent},
  {path: 'clients/create', component: CreateClientComponent},
  {path: 'clients/client-list', component: ShowClientsComponent},
  {path: 'clients/counselings', component: ShowCounselingsComponent},
  {path: 'clients/reports', component: ReportComponent},
  {path: 'clients/:id', component: ShowSingleClientComponent},
  {path: 'clients/create/employer', component: CreateEmployerComponent},
  {path: 'clients/employers/:id', component: ShowSingleEmployerComponent},
  {path: 'clients/:id/create-counseling', component: CreateCounselingComponent},
  {path: 'clients/:id/edit', component: EditClientComponent},
  {path: 'clients/:client_id/counselings/:counseling_id', component: ShowCounselingComponent},
  {path: 'clients/:client_id/tasks/:task_id', component: ShowSingleTaskComponent},

];
