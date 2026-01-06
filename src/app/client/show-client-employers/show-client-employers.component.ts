import { Component, input, inject, signal, effect, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EmployerService } from '../service/employer.service';
import { CommonService } from '../../common/services/common.service';
import { ModalDismissReasons, NgbCollapse, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientEmployerJobDescription } from '../model/client-employer-job-description';
import { EditClientEmployerJobDescriptionComponent } from '../edit-client-employer-job-description/edit-client-employer-job-description.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-show-client-employers',
  standalone: true,
  templateUrl: './show-client-employers.component.html',
  imports: [
    NgbCollapse,
    DatePipe
  ],
  styleUrls: ['./show-client-employers.component.css']
})
export class ShowClientEmployersComponent {
  // Services injected using inject()
  private readonly employerService = inject(EmployerService);
  private readonly commonService = inject(CommonService);
  private readonly modalService = inject(NgbModal);

  // Signal-based input
  readonly clientId = input.required<string>();

  // Component state as signals
  readonly clientEmployerJobDescriptions = signal<ClientEmployerJobDescription[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly isCollapsed = signal(true);

  // Convert employer subject observable to signal
  private readonly employerSubjectSignal = toSignal(this.commonService.employerSubject);

  constructor() {
    // Load employers when clientId is available or changes
    effect(() => {
      const id = this.clientId();
      if (id) {
        untracked(() => {
          this.loadEmployersForClient(id);
        });
      }
    });

    // Watch for employer updates from common service
    effect(() => {
      const reload = this.employerSubjectSignal();
      if (reload === true) {
        const id = this.clientId();
        if (id) {
          untracked(() => {
            this.loadEmployersForClient(id);
            this.modalService.dismissAll();
          });
        }
      }
    });
  }

  private loadEmployersForClient(clientId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.employerService.getEmployersForClient(clientId).subscribe({
      next: (employers) => {
        this.clientEmployerJobDescriptions.set(employers);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load employers');
        this.loading.set(false);
        console.error('Error loading employers:', err);
      }
    });
  }

  deleteEmployerFromClient(employerId: string): void {
    const clientId = this.clientId();

    this.employerService.deleteEmployerFromClient(employerId, clientId).subscribe({
      next: () => {
        this.commonService.setEmployerSubject(true);
        this.modalService.dismissAll();
      },
      error: (err) => {
        this.error.set('Failed to delete employer');
        console.error('Error deleting employer:', err);
      }
    });
  }

  edit(clientEmployerJobDescription: ClientEmployerJobDescription): void {
    const assignModal = this.modalService.open(
      EditClientEmployerJobDescriptionComponent,
      {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg'
      }
    );

    assignModal.componentInstance.clientEmployerJobDescription = clientEmployerJobDescription;
    assignModal.componentInstance.clientId = this.clientId();

    assignModal.result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
      },
      (reason) => {
        console.log(`Dismissed ${this.getDismissReason(reason)}`);
      }
    );
  }

  openDeleteConfirmationModal(content: any): void {
    this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
      },
      (reason) => {
        console.log(`Dismissed ${this.getDismissReason(reason)}`);
      }
    );
  }

  yes(employerId: string): void {
    this.deleteEmployerFromClient(employerId);
  }

  no(): void {
    this.modalService.dismissAll();
  }

  toggleCollapse(): void {
    // If you need per-item collapse, you'll need to track state per item
    // For now, keeping the single isCollapsed signal
    this.isCollapsed.update(collapsed => !collapsed);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
