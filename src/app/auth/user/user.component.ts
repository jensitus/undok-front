import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import { User } from '../model/user';
import { ChangePwDto } from '../model/change-pw-dto';
import { SetAdminDto } from '../../admin-template/layout/dashboard/components/show-users/model/set-admin-dto';
import { AlertComponent } from '../../admin-template/layout/components/alert/alert.component';
import { PageHeaderComponent } from '../../admin-template/shared/page-header/page-header.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faTachometerAlt,
  faUsers,
  faUser,
  faEnvelope,
  faShieldAlt,
  faKey,
  faLock,
  faUnlock,
  faCog,
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

export interface LockUser {
  id: string;
  lock: boolean;
}

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  imports: [
    AlertComponent,
    PageHeaderComponent,
    FaIconComponent,
    FormsModule,
    NgbCollapse
  ],
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  // Icons
  protected readonly faTachometerAlt = faTachometerAlt;
  protected readonly faUsers = faUsers;
  protected readonly faUser = faUser;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faShieldAlt = faShieldAlt;
  protected readonly faKey = faKey;
  protected readonly faLock = faLock;
  protected readonly faUnlock = faUnlock;
  protected readonly faCog = faCog;
  protected readonly faCheckCircle = faCheckCircle;
  protected readonly faTimesCircle = faTimesCircle;
  protected readonly faExclamationCircle = faExclamationCircle;

  // User state
  readonly currentUser = signal<User | null>(null);
  readonly user = signal<User | null>(null);

  readonly isOwnProfile = computed(() =>
    !!this.currentUser() && !!this.user() &&
    this.currentUser()!.email === this.user()!.email
  );

  readonly isOtherUser = computed(() =>
    !!this.currentUser() && !!this.user() &&
    this.currentUser()!.username !== this.user()!.username
  );

  private readonly params = toSignal(this.activatedRoute.params);
  readonly username = computed(() => this.params()?.['username'] ?? '');

  // Change password state
  readonly pwCollapsed = signal(true);
  readonly oldPassword = signal('');
  readonly newPassword = signal('');
  readonly passwordConfirmation = signal('');
  readonly pwLoading = signal(false);

  readonly isPwFormValid = computed(() =>
    this.oldPassword().trim() !== '' &&
    this.newPassword().trim() !== '' &&
    this.passwordConfirmation().trim() !== ''
  );

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadUser();
  }

  private loadCurrentUser(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUser.set(JSON.parse(userJson));
    }
  }

  private loadUser(): void {
    const username = this.username();
    if (!username) { return; }
    this.userService.getByUsername(username)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: data => this.user.set(data),
          error: err => this.alertService.error(err)
        });
  }

  setAdmin(userId: string, currentAdminStatus: boolean): void {
    const setAdminDto: SetAdminDto = { admin: !currentAdminStatus };
    this.userService.setAdmin(userId, setAdminDto)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: message => {
            this.alertService.success(message.text, true);
            this.loadUser();
          },
          error: err => this.alertService.error(err)
        });
  }

  resendConfirmationLink(userId: string): void {
    this.userService.resendConfirmationLink(userId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: value => this.alertService.success(value.text, true),
          error: err => this.alertService.error(err)
        });
  }

  lockUser(): void {
    const u = this.user();
    if (!u) { return; }
    const lockUser: LockUser = { id: u.id, lock: !u.locked };
    this.userService.lockUser(lockUser)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: value => {
            this.alertService.success(value.text, true);
            this.loadUser();
          },
          error: err => this.alertService.error(err)
        });
  }

  changePassword(): void {
    if (!this.isPwFormValid()) { return; }
    const u = this.user();
    if (!u) { return; }

    this.pwLoading.set(true);
    const dto: ChangePwDto = {
      userId: u.id as any,
      oldPassword: this.oldPassword(),
      password: this.newPassword(),
      passwordConfirmation: this.passwordConfirmation()
    };

    this.userService.changePassword(dto)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data: any) => {
            this.alertService.success(data.text, true);
            this.oldPassword.set('');
            this.newPassword.set('');
            this.passwordConfirmation.set('');
            this.pwLoading.set(false);
            this.pwCollapsed.set(true);
          },
          error: err => {
            this.alertService.error(err);
            this.pwLoading.set(false);
          }
        });
  }
}
