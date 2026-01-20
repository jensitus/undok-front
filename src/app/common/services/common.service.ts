import {Injectable, signal, Signal} from '@angular/core';
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

  // Modern signal-based state management
  private readonly _demo = signal<boolean>(false);
  private readonly _createUser = signal<boolean>(false);
  private readonly _createCounseling = signal<boolean>(false);
  private readonly _createEmployer = signal<boolean>(false);
  private readonly _reload = signal<boolean>(false);
  private readonly _employer = signal<boolean>(false);
  private readonly _alert = signal<string | null>(null);
  private readonly _delete = signal<boolean>(false);

  // Public readonly signals
  readonly demo: Signal<boolean> = this._demo.asReadonly();
  readonly createUser: Signal<boolean> = this._createUser.asReadonly();
  readonly createCounseling: Signal<boolean> = this._createCounseling.asReadonly();
  readonly createEmployer: Signal<boolean> = this._createEmployer.asReadonly();
  readonly reload: Signal<boolean> = this._reload.asReadonly();
  readonly employer: Signal<boolean> = this._employer.asReadonly();
  readonly alert: Signal<string | null> = this._alert.asReadonly();
  readonly delete: Signal<boolean> = this._delete.asReadonly();

  // Setter methods for state updates
  setDelete(value: boolean): void {
    this._delete.set(!!value);
  }

  setReload(value: boolean): void {
    this._reload.set(!!value);
  }

  setAlert(value: string | null): void {
    this._alert.set(value);
  }

  setDemo(value: boolean): void {
    this._demo.set(!!value);
  }

  checkAuthToken() {
    this.getCurrentUser();
    if (this.currentUser == null) {
      this.router.navigate(['/login']);
      return;
    }
    this.userService.checkAuthToken(this.currentUser.accessToken).subscribe({
      next: (data) => {
        this.data = data;
      },
      error: (error) => {
        console.log('error token check', error.message);
      }
    });
  }

  private getCurrentUser() {
    this.currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  setCreateUser(value: boolean): void {
    this._createUser.set(!!value);
  }

  setCreateCounseling(value: boolean): void {
    this._createCounseling.set(!!value);
  }

  setCreateEmployer(value: boolean): void {
    this._createEmployer.set(!!value);
  }

  setEmployer(value: boolean): void {
    this._employer.set(!!value);
  }

}
