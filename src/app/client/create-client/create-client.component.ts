import {Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ClientService} from '../service/client.service';
import {faTachometerAlt, faUsers} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {Label} from '../model/label';
import {AlertComponent} from '../../admin-template/layout/components/alert/alert.component';
import {PageHeaderComponent} from '../../admin-template/shared/page-header/page-header.component';
import {ReactiveFormsModule, FormControl} from '@angular/forms';

@Component({
  selector: 'app-create-client',
  standalone: true,
  templateUrl: './create-client.component.html',
  imports: [
    AlertComponent,
    PageHeaderComponent,
    ReactiveFormsModule
  ],
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent {

  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  readonly keywordControl = new FormControl('');
  readonly loading = signal(false);

  protected readonly Label = Label;
  protected readonly faUsers = faUsers;
  protected readonly faTachometerAlt = faTachometerAlt;

  submitClientForm() {
    this.loading.set(true);
    this.clientService.createClient({keyword: this.keywordControl.value ?? ''})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.router.navigate(['/clients/' + result.id + '/edit']);
          this.loading.set(false);
        },
        error: (error) => {
          this.alertService.error(error.error.text);
          this.loading.set(false);
        }
      });
  }
}
