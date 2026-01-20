import { Component, OnInit, signal, inject, DestroyRef, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { NgClass } from '@angular/common';

interface ResetPasswordForm {
  password: string;
  password_confirmation: string;
  email: string;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  imports: [
    NavbarComponent,
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  // Inject services
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  // Signals for reactive state
  token = signal<string>('');
  email = signal<string>('');
  loading = signal<boolean>(false);
  submitted = signal<boolean>(false);

  // Form group with typed interface
  resetForm: FormGroup<{
    password: any;
    password_confirmation: any;
    email: any;
  }>;

  // Computed signal for form validation state
  isFormValid = computed(() => {
    return this.resetForm?.valid ?? false;
  });

  // Getter for form controls (for template access)
  get f() {
    return this.resetForm.controls;
  }

  ngOnInit() {
    // Get token from route params
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.token.set(params['token']);
      });

    // Get email from query params
    const emailParam = this.activatedRoute.snapshot.queryParamMap.get('email');
    if (emailParam) {
      this.email.set(emailParam);
    }

    // Check if token is expired
    this.userService.checkTokenExpired(this.token(), this.email())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => {
          if (data.message) {
            this.alertService.error(data.message, true);
            this.router.navigate(['/login']);
          }
          if (data.status) {
            if (data.status === 204) {
              this.alertService.error('session expired', true);
              this.router.navigate(['/forgot']);
            } else if (data.status === 200) {
              console.log('Token is valid');
            }
          }
        },
        error: (error) => {
          this.alertService.error(error, true);
        }
      });

    // Initialize form
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      email: [this.email(), Validators.required]
    });
  }

  onSubmit() {
    this.submitted.set(true);

    if (this.resetForm.invalid) {
      this.alertService.error('Please fill out all fields correctly');
      return;
    }

    this.loading.set(true);

    // Create User object for password reset
    const resetData = {
      email: this.email(),
      password: this.resetForm.value.password,
      passwordConfirmation: this.resetForm.value.password_confirmation
    } as User;
    this.userService.resetPassword(resetData, this.token(), this.email())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => {
          this.alertService.success('Password reset successfully', true);
          this.router.navigate(['/login']);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error resetting password:', error);
          this.alertService.error(error);
          this.loading.set(false);
        }
      });
  }
}
