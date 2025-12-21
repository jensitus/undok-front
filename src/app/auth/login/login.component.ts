import { Component, output, signal, inject, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import { AlertComponent } from '../../admin-template/layout/components/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AlertComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Inject services
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly alertService = inject(AlertService);

  // Output as signal
  readonly toggle = output<any>();

  // Signals for state
  loading = signal<boolean>(false);
  submitted = signal<boolean>(false);
  returnUrl = signal<string>('');

  // Reactive form
  readonly loginForm: FormGroup;

  // Computed signal for form controls (convenience getter)
  readonly controls = computed(() => this.loginForm.controls);

  // Computed signals for validation errors
  readonly usernameErrors = computed(() => {
    const control = this.loginForm.get('username');
    return this.submitted() && control?.errors ? control.errors : null;
  });

  readonly passwordErrors = computed(() => {
    const control = this.loginForm.get('password');
    return this.submitted() && control?.errors ? control.errors : null;
  });

  constructor() {
    // Initialize form
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Reset login status
    this.authenticationService.logout();

    // Get return url from route parameters or default to '/'
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.returnUrl.set(returnUrl);
  }

  onSubmit(): void {
    this.submitted.set(true);

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);

    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authenticationService
        .login(username, password)
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/second-factor']);
          },
          error: (error) => {
            this.alertService.error(error.error?.text || 'Login failed');
            this.loading.set(false);
          }
        });
  }
}
