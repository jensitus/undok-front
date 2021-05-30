import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../../../../../auth/model/user';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UserService} from '../../../../../../auth/services/user.service';
import {SetAdminDto} from '../model/set-admin-dto';
import {ResponseMessage} from '../../../../../../common/helper/response-message';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  userList: User[];
  setAdminDto: SetAdminDto;
  responseMessage: ResponseMessage;
  private unsubscribe$ = new Subject();

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.getUserList();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  setAdmin(user_id, admin) {
    admin = !admin;
    this.setAdminDto = {
      admin: admin
    };
    this.userService.setAdmin(user_id, this.setAdminDto).pipe(takeUntil(this.unsubscribe$)).subscribe(message => {
      this.responseMessage = message;
      if (this.responseMessage.text === 'successfully changed' ) {
        this.getUserList();
      }
    });
  }

  private getUserList(): void {
    this.userService.getAll().pipe(takeUntil(this.unsubscribe$)).subscribe(userResult => {
      this.userList = userResult;
    });
  }

}
