import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { faTachometerAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user.service';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import { User } from '../model/user';
import { SetAdminDto } from '../../admin-template/layout/dashboard/components/show-users/model/set-admin-dto';
import { ResponseMessage } from '../../common/helper/response-message';
import { AlertComponent } from '../../admin-template/layout/components/alert/alert.component';
import { PageHeaderComponent } from '../../admin-template/shared/modules/page-header/page-header.component';

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
    RouterLink,
    FormsModule
  ],
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  // Inject services
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);

  // Icons
  protected readonly faUsers = faUsers;
  protected readonly faTachometerAlt = faTachometerAlt;

  // Signals for reactive state
  readonly currentUser = signal<User | null>(null);
  readonly user = signal<User | null>(null);
  readonly responseMessage = signal<ResponseMessage | null>(null);

  // Convert route params to signal
  private readonly params = toSignal(this.activatedRoute.params);

  // Computed signal for username from route
  readonly username = computed(() => this.params()?.['username'] ?? '');

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
        .subscribe({
          next: data => this.user.set(data),
          error: err => this.alertService.error(err)
        });
  }

  setAdmin(userId: string, currentAdminStatus: boolean): void {
    const newAdminStatus = !currentAdminStatus;
    const setAdminDto: SetAdminDto = {
      admin: newAdminStatus
    };

    this.userService.setAdmin(userId, setAdminDto)
        .subscribe({
          next: message => {
            this.responseMessage.set(message);
            this.alertService.success(message.text, true);
            this.loadUser();
          },
          error: err => this.alertService.error(err)
        });
  }

  resendConfirmationLink(userId: string): void {
    this.userService.resendConfirmationLink(userId)
        .subscribe({
          next: value => {
            this.alertService.success(value.text, true);
          },
          error: err => console.error('Error resending confirmation link:', err)
        });
  }

  lockUser(): void {
    const currentUser = this.user();
    if (!currentUser) { return; }

    const lockUser: LockUser = {
      id: currentUser.id,
      lock: !currentUser.locked
    };

    this.userService.lockUser(lockUser)
        .subscribe({
          next: value => {
            this.alertService.success(value.text, true);
            this.loadUser();
          },
          error: err => this.alertService.error(err)
        });
  }
}
