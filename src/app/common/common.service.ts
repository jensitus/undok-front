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
  data: any;

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
    console.log(this.currentUser != null);
    if (this.currentUser != null) {
      console.log(this.currentUser.auth_token);
      this.userService.checkAuthToken(this.currentUser.auth_token).subscribe(data => {
        this.data = JSON.stringify({data});
        console.log('checkauthtoken', this.data);
      }, error => {
        console.log('erroraauthcheck', error);
        this.alertService.error(error, true);
        this.router.navigate(['/login']);
      });
    } else {
      this.router.navigate(['/login']);
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
