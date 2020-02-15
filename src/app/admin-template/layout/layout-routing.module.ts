import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {HomeComponent} from '../../common/home/home.component';
import {TaskComponent} from './components/task/task.component';
import {UserComponent} from '../../auth/user/user.component';
import {EditUserComponent} from '../../auth/edit-user/edit-user.component';
import {ChangePasswordComponent} from '../../auth/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'prefix'},
      // {path: 'home', component: HomeComponent},
      // {path: '', redirectTo: 'home', pathMatch: 'full'}
      {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
      {path: 'tasks/:formKey/:taskId', component: TaskComponent},
      {path: 'users/:username', component: UserComponent},
      {path: 'users/:username/edit', component: EditUserComponent},
      {path: 'users/:username/changepw', component: ChangePasswordComponent},
      { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule) },
      /*            { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
                  { path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
                  { path: 'bs-element', loadChildren: () => import('./bs-element/bs-element.module').then(m => m.BsElementModule) },
                  { path: 'grid', loadChildren: () => import('./grid/grid.module').then(m => m.GridModule) },
                  { path: 'components', loadChildren: () => import('./bs-component/bs-component.module').then(m => m.BsComponentModule) },
                  { path: 'blank-page', loadChildren: () => import('./blank-page/blank-page.module').then(m => m.BlankPageModule) }

       */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {
}
