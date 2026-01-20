import {Component, OnInit, inject, signal, effect, DestroyRef} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../../../../../auth/model/user';
import { UserService } from '../../../../../../auth/services/user.service';
import { ResponseMessage } from '../../../../../../common/helper/response-message';
import { CommonService } from '../../../../../../common/services/common.service';
import { AlertService } from '../../../../components/alert/services/alert.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  imports: [
    RouterLink,
    RouterLinkActive,
    FaIconComponent
  ],
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  // Inject services using the new inject() function
  private readonly userService = inject(UserService);
  private readonly commonService = inject(CommonService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  // Use signals for reactive state management
  readonly userList = signal<User[]>([]);
  readonly responseMessage = signal<ResponseMessage | null>(null);
  readonly faCheck = faCheck;

  constructor() {
    // Set up effect to watch for user creation events
    effect(() => {
      if (this.commonService.createUser()) {
        this.getUserList();
      }
    });
  }

  ngOnInit(): void {
    this.getUserList();
  }

  private getUserList(): void {
    this.userService.getAll()
        .subscribe(userResult => {
          this.userList.set(userResult);
        });
  }

  resendConfirmationLink(userId: string): void {
    this.userService.resendConfirmationLink(userId)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: value => {
            this.alertService.success(value.text, true);
          },
          error: err => console.error('Error resending confirmation link:', err)
        });
  }
}
