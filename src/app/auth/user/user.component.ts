import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {User} from '../model/user';
import {takeUntil} from 'rxjs/operators';
import {SetAdminDto} from '../../admin-template/layout/dashboard/components/show-users/model/set-admin-dto';
import {ResponseMessage} from '../../common/helper/response-message';
import {Subject, Subscription} from 'rxjs';
import {faCheck, faTachometerAlt, faUsers} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  currentUser: User;
  username: string;
  user: User;
  setAdminDto: SetAdminDto;
  responseMessage: ResponseMessage;
  userList: User[];
  faCheck = faCheck;
  private unsubscribe$: Subscription[] = [];
  protected readonly faUsers = faUsers;
  protected readonly faTachometerAlt = faTachometerAlt;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.getCurrentUser();
    this.getUser();
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  private getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  setAdmin(user_id, admin) {
    console.log(user_id, admin);
    admin = !admin;
    this.setAdminDto = {
      admin: admin
    };
    this.unsubscribe$.push(this.userService.setAdmin(user_id, this.setAdminDto).subscribe(message => {
      this.responseMessage = message;
      this.alertService.success(message.text, true);
      this.getUser();
    }));
  }

  getUser() {
    this.activatedRoute.params.subscribe(params => {
      this.username = params['username'];
    });
    this.unsubscribe$.push(this.userService.getByUsername(this.username).subscribe(data => {
      this.user = data;
      console.log('user: ', this.user);
      this.alertService.success('hi');
    }, error => {
      this.alertService.error(error);
    }));
  }

  resendConfirmationLink(userId: string) {
    this.userService.resendConfirmationLink(userId).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: value => {
        this.alertService.success(value.text, true);
      },
      error: err => console.log('Himmel', err)
    });
  }
}
