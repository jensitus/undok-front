import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import { AuthenticationService } from '../services/authentication.service';
import { AlertComponent } from '../../admin-template/layout/components/alert/alert.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [
    AlertComponent,
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Inject services
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthenticationService);

  // Signals for reactive state
  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly error = signal<string | null>(null);

  // Form group (reactive forms still work great with signals)
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      passwordConfirmation: ['', Validators.required]
    });
  }

  // Getter for form controls (for template access)
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.registerForm.invalid) {
      return;
    }

    this.loading.set(true);

    this.authService.register(this.registerForm.value)
        .subscribe({
          next: () => {
            this.alertService.success('Registration successful', true);
            this.loading.set(false);
            this.router.navigate(['/login']);
          },
          error: err => {
            this.alertService.error(err.error?.text || 'Registration failed', true);
            this.loading.set(false);
          }
        });
  }
}
