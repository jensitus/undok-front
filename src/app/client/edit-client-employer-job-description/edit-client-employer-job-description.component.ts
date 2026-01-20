import { Component, inject, signal } from '@angular/core';
import { ClientEmployerJobDescription } from '../model/client-employer-job-description';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientEmployerForm } from '../model/client-employer-form';
import { EmployerService } from '../service/employer.service';
import { CommonService } from '../../common/services/common.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-client-employer-job-description',
  standalone: true,
  templateUrl: './edit-client-employer-job-description.component.html',
  imports: [FormsModule],
  styleUrls: ['./edit-client-employer-job-description.component.css']
})
export class EditClientEmployerJobDescriptionComponent {
  // Services injected using inject()
  readonly activeModal = inject(NgbActiveModal);
  private readonly employerService = inject(EmployerService);
  private readonly commonService = inject(CommonService);

  // Public properties that parent can set via componentInstance
  // These are set by the parent when opening the modal
  clientEmployerJobDescription!: ClientEmployerJobDescription;
  clientId!: string;

  // Component state as signals
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  submit(): void {
    if (!this.clientEmployerJobDescription) {
      this.error.set('No job description data available');
      return;
    }

    if (this.loading()) {
      return; // Prevent double submission
    }

    this.loading.set(true);
    this.error.set(null);

    const clientEmployerForm: ClientEmployerForm = {
      id: this.clientEmployerJobDescription.id,
      clientId: this.clientId,
      from: this.clientEmployerJobDescription.from,
      industry: this.clientEmployerJobDescription.industry,
      industrySub: this.clientEmployerJobDescription.industrySub,
      jobFunction: this.clientEmployerJobDescription.jobFunction,
      jobRemarks: this.clientEmployerJobDescription.jobRemarks,
      until: this.clientEmployerJobDescription.until,
      employerId: this.clientEmployerJobDescription.employer.id
    };

    this.employerService.updateClientEmployer(clientEmployerForm).subscribe({
      next: (result) => {
        if (result === true) {
          this.commonService.setEmployer(true);
        }

        // Reset to false after a brief delay so next update triggers the effect again
        setTimeout(() => {
          this.commonService.setEmployer(false);
        }, 100);

        this.loading.set(false);
        // Modal will be closed by parent component watching the employer subject
      },
      error: (err) => {
        const errorMessage = err?.error?.message || 'Failed to update employer job description';
        this.error.set(errorMessage);
        this.loading.set(false);
        console.error('Error updating client employer:', err);
      }
    });
  }
}
