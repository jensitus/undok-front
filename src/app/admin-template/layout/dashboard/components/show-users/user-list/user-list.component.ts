import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../../../../../auth/model/user';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UserService} from '../../../../../../auth/services/user.service';
import {ResponseMessage} from '../../../../../../common/helper/response-message';
import {CommonService} from '../../../../../../common/services/common.service';
import {faCheck} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  faCheck = faCheck;
  userList: User[];
  responseMessage: ResponseMessage;
  private unsubscribe$ = new Subject();

  constructor(
    private userService: UserService,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    this.getUserList();
    this.getCreateUserSubject();
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this.unsubscribe$.next();
  }

  private getUserList(): void {
    this.userService.getAll().pipe(takeUntil(this.unsubscribe$)).subscribe(userResult => {
      this.userList = userResult;
    });
  }

  private getCreateUserSubject() {
    this.commonService.createUserSubject.subscribe(res => {
      if (res) {
        this.getUserList();
      }
    });
  }

}
