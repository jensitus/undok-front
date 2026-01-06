import { Component, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SecondFactorForm } from '../model/second-factor-form';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import { AlertComponent } from '../../admin-template/layout/components/alert/alert.component';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [
    AlertComponent,
    FormsModule
  ],
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.css']
})
export class TwoFactorComponent {
  // Inject services
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);

  // Signals for state
  twoFactorToken = signal<string>('');
  currentUser = signal<User | null>(null);
  secondFactorUser = signal<User | null>(null);
  isSubmitting = signal<boolean>(false);

  // Computed signal for form validity
  isFormValid = computed(() => {
    return this.twoFactorToken().trim().length > 0;
  });

  constructor() {
    // Load current user from localStorage
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUser.set(user);
        this.alertService.success('we\'ve sent you a little token for signing in', true);
      } catch (error) {
        console.error('Failed to parse current user:', error);
        this.router.navigate(['/login']);
      }
    } else {
      // No user found, redirect to login
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    const user = this.currentUser();

    if (!user || !this.isFormValid()) {
      return;
    }

    if (this.isSubmitting()) {
      return; // Prevent double submission
    }

    this.isSubmitting.set(true);

    const secondFactorForm: SecondFactorForm = {
      userId: user.id,
      token: this.twoFactorToken()
    };

    this.userService
        .sendSecondFactorToken(secondFactorForm)
        .subscribe({
          next: (result) => {
            this.secondFactorUser.set(result.userDto);

            // Update localStorage
            localStorage.clear();
            localStorage.setItem('currentUser', JSON.stringify(result.userDto));

            this.isSubmitting.set(false);
            this.alertService.success('yes', true)
            this.router.navigate(['home']);
          },
          error: (error) => {
            console.error('Second factor authentication failed:', error);
            this.alertService.error(error.error?.text || 'Authentication failed');
            this.isSubmitting.set(false);
          }
        });
  }
}
