import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {UserComponent} from '../../auth/user/user.component';
import {EditUserComponent} from '../../auth/edit-user/edit-user.component';
import {ChangePasswordComponent} from '../../auth/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'prefix'},
      {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
      {path: 'users/:username', component: UserComponent},
      {path: 'users/:username/edit', component: EditUserComponent},
      {path: 'users/:username/changepw', component: ChangePasswordComponent},
      {path: 'list-users', loadChildren: () => import('./dashboard/components/show-users/create-user.module').then(m => m.CreateUserModule)},
      { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule) },
      {path: 'clients', loadChildren: () => import('../../client/client.module').then(c => c.ClientModule)}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {
}
