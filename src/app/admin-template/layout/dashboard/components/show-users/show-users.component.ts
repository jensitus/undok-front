import {Component, OnDestroy, OnInit} from '@angular/core';
import {faTachometerAlt, faUsers} from '@fortawesome/free-solid-svg-icons';
import {PageHeaderComponent} from '../../../../shared/modules/page-header/page-header.component';
import {AlertComponent} from '../../../components/alert/alert.component';
import {UserListComponent} from './user-list/user-list.component';
import {CreateUserComponent} from './create-user/create-user.component';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  imports: [
    PageHeaderComponent,
    AlertComponent,
    UserListComponent,
    CreateUserComponent
  ],
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent implements OnInit, OnDestroy {

  protected readonly faUsers = faUsers;
  protected readonly faTachometerAlt = faTachometerAlt;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
