import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {User} from '../model/user';
import {SetAdminDto} from '../../admin-template/layout/dashboard/components/show-users/model/set-admin-dto';
import {ResponseMessage} from '../../common/helper/response-message';
import {Subscription} from 'rxjs';
import {faTachometerAlt, faUsers} from '@fortawesome/free-solid-svg-icons';

export interface LockUser {
  id: string;
  lock: boolean;
}

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
  private unsubscribe$: Subscription[] = [];
  private locked: boolean;
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
    admin = !admin;
    this.setAdminDto = {
      admin: admin
    };
    this.unsubscribe$.push(
      this.userService.setAdmin(user_id, this.setAdminDto).subscribe(message => {
        this.responseMessage = message;
        this.alertService.success(message.text, true);
        this.getUser();
      }));
  }

  getUser() {
    this.activatedRoute.params.subscribe(params => {
      this.username = params['username'];
    });
    this.unsubscribe$.push(
      this.userService.getByUsername(this.username).subscribe(data => {
        this.user = data;
      }, error => {
        this.alertService.error(error);
      }));
  }

  resendConfirmationLink(userId: string) {
    this.unsubscribe$.push(
      this.userService.resendConfirmationLink(userId).subscribe({
        next: value => {
          this.alertService.success(value.text, true);
        },
        error: err => console.log('Himmel', err)
      })
    );
  }

  lockUser() {
    const lockUser: LockUser = {
      id: this.user.id,
      lock: !this.user.locked
    };
    this.unsubscribe$.push(
      this.userService.lockUser(lockUser).subscribe({
        next: value => {
          this.alertService.success(value.text, true);
          this.getUser();
        },
        error: err => this.alertService.error(err)
      })
    );
  }
}
