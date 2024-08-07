import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CreateUserComponent} from './create-user/create-user.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { UserListComponent } from './user-list/user-list.component';
import {ShowUsersComponent} from './show-users.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AlertModule} from '../../../components/alert/alert.module';
import {PageHeaderModule} from '../../../../shared';

const routes: Routes = [
  {path: '', component: ShowUsersComponent}
];

@NgModule({
  declarations: [CreateUserComponent, UserListComponent, ShowUsersComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        FontAwesomeModule,
        AlertModule,
        PageHeaderModule
    ]
})
export class CreateUserModule { }
