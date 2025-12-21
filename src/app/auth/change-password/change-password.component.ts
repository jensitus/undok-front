import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../services/user.service';
import { ChangePwDto } from '../model/change-pw-dto';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import { AlertComponent } from '../../admin-template/layout/components/alert/alert.component';
import { PageHeaderComponent } from '../../admin-template/shared/modules/page-header/page-header.component';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    AlertComponent,
    PageHeaderComponent,
    FormsModule
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  // Inject services
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly alertService = inject(AlertService);

  // Signals for reactive state
  loading = signal<boolean>(false);
  submitted = signal<boolean>(false);
  username = signal<string>('');
  userId = signal<number>(0);
  oldPassword = signal<string>('');
  newPassword = signal<string>('');
  passwordConfirmation = signal<string>('');

  // Font Awesome icons (can remain as regular properties)
  protected readonly faUser = faUser;
  protected readonly faKey = faKey;

  // Computed signal for validation
  isFormValid = computed(() => {
    return this.oldPassword().trim() !== '' &&
      this.newPassword().trim() !== '' &&
      this.passwordConfirmation().trim() !== '';
  });

  ngOnInit() {
    // Get username from route params
    this.activatedRoute.params
        .pipe(takeUntilDestroyed())
        .subscribe(params => {
          this.username.set(params['username']);

          // Fetch user data
          this.userService.getByUsername(this.username())
              .pipe(takeUntilDestroyed())
              .subscribe({
                next: (data: any) => {
                  this.userId.set(data.id);
                },
                error: (error) => {
                  console.error('Error fetching user:', error);
                  this.alertService.error('Failed to load user data');
                }
              });
        });
  }

  onSubmit() {
    this.submitted.set(true);
    this.loading.set(true);

    // Validate form
    if (!this.isFormValid()) {
      this.alertService.error('please fill out every field correctly');
      this.loading.set(false);
      return;
    }

    // Create change password DTO
    const changePwDto: ChangePwDto = {
      userId: this.userId(),
      password: this.newPassword(),
      passwordConfirmation: this.passwordConfirmation(),
      oldPassword: this.oldPassword()
    };

    // Submit password change
    this.userService.changePassword(changePwDto)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (data: any) => {
            this.alertService.success(data.text);
            this.loading.set(false);

            // Optionally reset form
            this.oldPassword.set('');
            this.newPassword.set('');
            this.passwordConfirmation.set('');
            this.submitted.set(false);
          },
          error: (error) => {
            console.error('Error changing password:', error);
            this.alertService.error('Failed to change password');
            this.loading.set(false);
          }
        });
  }
}
