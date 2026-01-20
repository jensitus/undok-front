import { Component, signal, inject, viewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../../../auth/services/user.service';
import { AlertService } from '../../../../components/alert/services/alert.service';
import { AuthenticationService } from '../../../../../../auth/services/authentication.service';
import { CommonService } from '../../../../../../common/services/common.service';
import { CreateUserForm } from '../../../../../../auth/model/create-user-form';
import { ResponseMessage } from '../../../../../../common/helper/response-message';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  // Inject services
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthenticationService);
  private readonly commonService = inject(CommonService);
  private readonly modalService = inject(NgbModal);

  // Signals for reactive state
  loading = signal<boolean>(false);
  submitted = signal<boolean>(false);
  error = signal<string>('');
  username = signal<string>('');
  email = signal<string>('');
  admin = signal<boolean>(false);
  responseMessage = signal<ResponseMessage | null>(null);
  confUrl = signal<string>('');

  // ViewChild for modal template
  confUrlModal = viewChild<TemplateRef<any>>('confUrlTemplate');

  onSubmit() {
    this.submitted.set(true);

    const createUserForm: CreateUserForm = {
      username: this.username(),
      email: this.email(),
      admin: this.admin()
    };

    this.loading.set(true);

    this.authService.createUserViaAdmin(createUserForm)
        .pipe(
          first(),
          takeUntilDestroyed()
        )
        .subscribe({
          next: (data) => {
            this.alertService.success('Registration successful', true);
            this.loading.set(false);
            this.commonService.setCreateUser(true);

            // Reset form
            this.username.set('');
            this.email.set('');

            // Store response
            this.responseMessage.set(data);
            this.confUrl.set(data.text);
          },
          error: (error) => {
            this.alertService.error(error.error?.text || 'An error occurred', true);
            this.loading.set(false);
          }
        });
  }

  openLg(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' });
  }
}
