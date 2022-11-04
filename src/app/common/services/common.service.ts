import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {UserService} from '../../auth/services/user.service';
import {Router} from '@angular/router';
import {User} from '../../auth/model/user';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';

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

  public demoSubject: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public createUserSubject: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public createCounselingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public createEmployerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public reloadSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public employerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public alertSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public deleteSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  setDeleteSubject(value) {
    if (value) {
      this.deleteSubject.next(value);
    } else {
      this.deleteSubject.next(null);
    }
  }

  setReloadSubject(value) {
    if (value) {
      this.reloadSubject.next(value);
    } else {
      this.reloadSubject.next(null);
    }
  }

  setAlertSubject(value) {
    if (value) {
      this.alertSubject.next(value);
    } else {
      this.alertSubject.next(null);
    }
  }

  setDemoSubject(value) {
    if (value) {
      this.demoSubject.next(value);
    } else {
      this.demoSubject.next(null);
    }
  }

  checkAuthToken() {
    this.getCurrentUser();
    if (this.currentUser == null) {
      this.router.navigate(['/login']);
      return;
    }
    this.userService.checkAuthToken(this.currentUser.accessToken).subscribe(data => {
      this.data = data;
      console.log('authToken', this.data);
    }, error => {
      console.log('error token check', error.message);
    });
  }

  private getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  setCreateUserSubject(value) {
    if (value) {
      this.createUserSubject.next(value);
    } else {
      this.createUserSubject.next(null);
    }
  }

  setCreateCounselingSubject(value) {
    if (value) {
      this.createCounselingSubject.next(value);
    } else {
      this.createCounselingSubject.next(null);
    }
  }

  setCreateEmployerSubject(value) {
    if (value) {
      this.createEmployerSubject.next(value);
    } else {
      this.createEmployerSubject.next(null);
    }
  }

  setEmployerSubject(value) {
    if (value) {
      this.employerSubject.next(value);
    } else {
      this.employerSubject.next(null);
    }
  }

}
