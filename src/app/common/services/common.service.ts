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

  currentUser: User | undefined;
  data: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private alertService: AlertService
  ) {
  }

  public demoSubject: BehaviorSubject<null> = new BehaviorSubject(null);
  public createUserSubject: BehaviorSubject<null> = new BehaviorSubject(null);
  // @ts-ignore
  public createCounselingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  // @ts-ignore
  public createEmployerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  // @ts-ignore
  public reloadSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  // @ts-ignore
  public employerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  // @ts-ignore
  public alertSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  // @ts-ignore
  public deleteSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  setDeleteSubject(value: boolean) {
    if (value) {
      this.deleteSubject.next(value);
    } else {
      // @ts-ignore
      this.deleteSubject.next(null);
    }
  }

  setReloadSubject(value: boolean) {
    if (value) {
      this.reloadSubject.next(value);
    } else {
      // @ts-ignore
      this.reloadSubject.next(null);
    }
  }

  setAlertSubject(value: string) {
    if (value) {
      this.alertSubject.next(value);
    } else {
      // @ts-ignore
      this.alertSubject.next(null);
    }
  }

  setDemoSubject(value: boolean) {
    if (value) {
      // @ts-ignore
      this.demoSubject.next(value);
    } else {
      // @ts-ignore
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
    }, error => {
      console.log('error token check', error.message);
    });
  }

  private getCurrentUser() {
    this.currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  setCreateUserSubject(value: boolean) {
    if (value) {
      // @ts-ignore
      this.createUserSubject.next(value);
    } else {
      // @ts-ignore
      this.createUserSubject.next(null);
    }
  }

  setCreateCounselingSubject(value: boolean) {
    if (value) {
      this.createCounselingSubject.next(value);
    } else {
      // @ts-ignore
      this.createCounselingSubject.next(null);
    }
  }

  setCreateEmployerSubject(value: boolean) {
    if (value) {
      this.createEmployerSubject.next(value);
    } else {
      // @ts-ignore
      this.createEmployerSubject.next(null);
    }
  }

  setEmployerSubject(value: boolean) {
    if (value) {
      this.employerSubject.next(value);
    } else {
      // @ts-ignore
      this.employerSubject.next(null);
    }
  }

}
