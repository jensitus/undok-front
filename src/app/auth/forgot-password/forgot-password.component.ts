import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  // Inject services
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);

  // Signals for reactive state
  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly data = signal<any>(null);

  // Form group
  forgotForm!: FormGroup;

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Getter for form controls (for template access)
  get f() {
    return this.forgotForm.controls;
  }

  onSubmit(): void {
    this.submitted.set(true);

    // Stop here if form is invalid
    if (this.forgotForm.invalid) {
      return;
    }

    this.loading.set(true);

    this.userService.forgotPassword(this.forgotForm.value)
        .subscribe({
          next: response => {
            console.log(response);
            this.data.set(response);
            this.alertService.success(response.text, true);
            this.loading.set(false);
            this.router.navigate(['/home']);
          },
          error: err => {
            console.error('Forgot password error:', err);
            this.loading.set(false);
            // Uncomment if you want to show error alerts
            // this.alertService.error(err.error?.text || 'An error occurred');
          }
        });
  }
}
