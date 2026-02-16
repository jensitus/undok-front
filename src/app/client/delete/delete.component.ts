import { Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DeleteTypes } from './delete-types';
import { DeleteService } from '../service/delete.service';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import { CommonService } from '../../common/services/common.service';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  imports: [DeleteModalComponent],
  standalone: true,
  styleUrl: './delete.component.css'
})
export class DeleteComponent {
  private deleteService = inject(DeleteService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private commonService = inject(CommonService);
  private destroyRef = inject(DestroyRef);

  deleteTypeClient: DeleteTypes = DeleteTypes.CLIENT;

  type = input.required<DeleteTypes>();
  idToDelete = input.required<string>();
  deleteObjectName = input<string>('');
  navigateAfterDelete = input<string>('');

  delete() {
    switch (this.type()) {
      case DeleteTypes.CLIENT:
        this.deleteService.deleteClient(this.idToDelete()).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: () => {
            this.commonService.setAlert('Client successfully deleted');
            this.commonService.setReload(true);
            this.router.navigate(['/clients/client-list']);
          },
          error: () => {
            this.alertService.error('Sorry but something went wrong');
          }
        });
        break;

      case DeleteTypes.EMPLOYER:
        this.deleteService.deleteEmployer(this.idToDelete()).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: () => {
            this.commonService.setAlert('Employer successfully deleted');
            this.router.navigate(['/clients/employers']);
          },
          error: (error) => {
            this.alertService.error(error.error.text);
          }
        });
        break;

      case DeleteTypes.COUNSELING:
        this.deleteService.deleteCounseling(this.idToDelete()).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: () => {
            this.commonService.setDelete(true);
            this.alertService.success('Counseling deleted successfully', true);
            this.router.navigate([this.navigateAfterDelete() || '/dashboard']);
          }
        });
        break;
    }
  }

  onConfirmation(confirmed: boolean) {
    if (confirmed) {
      this.delete();
    }
  }
}
