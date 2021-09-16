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
  public todoSubject: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public createUserSubject: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public taskSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public itemSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public descriptionUpdateSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public dueDateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public createCounselingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public createEmployerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public reloadClientSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public employerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  setReloadClientSubject(value) {
    if (value) {
      this.reloadClientSubject.next(value);
    } else {
      this.reloadClientSubject.next(null);
    }
  }

  setDemoSubject(value) {
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
    if (this.currentUser == null) {
      this.router.navigate(['/login']);
      return;
    }
    this.userService.checkAuthToken(this.currentUser.auth_token).subscribe(data => {
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

  setTaskSubject(value) {
    if (value) {
      this.taskSubject.next(value);
    } else {
      this.taskSubject.next(null);
    }
  }

  setItemSubject(value) {
    if (value) {
      this.itemSubject.next(value);
    } else {
      this.itemSubject.next(null);
    }
  }

  setDescriptionUpdateSubject(value) {
    if (value) {
      this.descriptionUpdateSubject.next(value);
    } else {
      this.descriptionUpdateSubject.next(null);
    }
  }

  setDueDateSubject(value) {
    if (value) {
      this.dueDateSubject.next(value);
    } else {
      this.dueDateSubject.next(null);
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
