import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserService} from '../auth/services/user.service';
import {Router} from '@angular/router';
import {User} from '../auth/model/user';
import {AlertService} from './alert/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  currentUser: User;

  constructor(
    private userService: UserService,
    private router: Router,
    private alertService: AlertService
  ) {
  }

  public demoSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public todoSubject: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public diarySubject: BehaviorSubject<boolean> = new BehaviorSubject(null);

  setSubject(value) {
    if (value) {
      this.demoSubject.next(value);
    } else {
      this.demoSubject.next(null);
    }
  }

  setNewTodoSubject(value) {
    if (value) {
      this.todoSubject.next(value);
    } else {
      this.todoSubject.next(null);
    }
  }

  checkAuthToken() {
    this.getCurrentUser();
    if (this.currentUser != null) {
      this.userService.checkAuthToken(this.currentUser.auth_token).subscribe(data => {
      }, error => {
        this.alertService.error(error, true);
        this.router.navigate(['/login']);
      });
    }
  }

  private getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  setDiarySubject(value) {
    if (value) {
      this.diarySubject.next(value);
    } else {
      this.diarySubject.next(null);
    }
  }

}
