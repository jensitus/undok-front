import { Component, OnInit, signal, inject, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import { ConfirmAccountForm } from '../model/confirm-account-form';
import { AuthenticationService } from '../services/authentication.service';
import { ResponseMessage } from '../../common/helper/response-message';
import { AlertComponent } from '../../admin-template/layout/components/alert/alert.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-confirm-account',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    AlertComponent
  ],
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css']
})
export class ConfirmAccountComponent implements OnInit {
  // Inject services using the new inject() function
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthenticationService);
  private readonly router = inject(Router);

  // Use signals for reactive state
  token = signal<string>('');
  email = signal<string>('');
  data = signal<ResponseMessage | null>(null);
  oldPassword = signal<string>('');
  password = signal<string>('');
  passwordConfirmation = signal<string>('');
  username = signal<string>('');
  responseMessage = signal<ResponseMessage | null>(null);

  ngOnInit() {
    // Get route params and confirm account
    this.activatedRoute.params
        .pipe(takeUntilDestroyed())
        .subscribe(params => {
          this.token.set(params['token']);
          this.email.set(params['email']);

          console.log(this.token(), this.email());

          this.userService.confirmAccount(this.token(), this.email())
              .pipe(takeUntilDestroyed())
              .subscribe({
                next: (data) => {
                  this.data.set(data);

                  if (data.text === 'token valid') {
                    this.alertService.success('please change your password', true);
                  } else if (data.text === 'token valid and password has not to be changed' && data.redirect === true) {
                    this.alertService.success('account successfully confirmed');
                  } else {
                    this.alertService.error('too late, contact your administrator', true);
                    this.router.navigate(['/home']);
                  }
                },
                error: (error) => {
                  console.error('Error confirming account:', error);
                  this.alertService.error('An error occurred', true);
                }
              });
        });
  }

  onSubmit() {
    const confirmAccountDto: ConfirmAccountForm = {
      username: this.username(),
      confirmationToken: this.token(),
      email: this.email(),
      password: this.password(),
      passwordConfirmation: this.passwordConfirmation(),
      oldPassword: this.oldPassword()
    };

    this.authService.confirmAccountAndSetNewPassword(confirmAccountDto)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (result) => {
            this.responseMessage.set(result);
            console.log(result);

            if (result.text === 'User successfully confirmed') {
              this.alertService.success(result.text, true);
              this.router.navigate(['/login']);
            }
          },
          error: (error) => {
            console.error('Error setting password:', error);
            this.alertService.error('Failed to set password', true);
          }
        });
  }
}
