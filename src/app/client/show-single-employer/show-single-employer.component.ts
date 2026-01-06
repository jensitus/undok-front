import {Component, effect, inject, signal, untracked} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {EmployerService} from '../service/employer.service';
import {Employer} from '../model/employer';
import {faSurprise} from '@fortawesome/free-solid-svg-icons';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {DeleteTypes} from '../delete/delete-types';
import {DeleteComponent} from '../delete/delete.component';
import {EditEmployerComponent} from '../edit-employer/edit-employer.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {AlertComponent} from '../../admin-template/layout/components/alert/alert.component';

@Component({
  selector: 'app-show-single-employer',
  standalone: true,
  templateUrl: './show-single-employer.component.html',
  imports: [
    DeleteComponent,
    EditEmployerComponent,
    FaIconComponent,
    AlertComponent
  ],
  styleUrls: ['./show-single-employer.component.css']
})
export class ShowSingleEmployerComponent {
  // Services injected using inject()
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly modalService = inject(NgbModal);
  private readonly employerService = inject(EmployerService);
  private readonly commonService = inject(CommonService);
  private readonly alertService = inject(AlertService);

  // Convert route params to signal
  private readonly routeParams = toSignal(this.activatedRoute.params);

  // Employer ID as computed signal from route params
  readonly employerId = signal<string | undefined>(undefined);

  // Component state as signals
  readonly employer = signal<Employer | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Constants
  readonly deleteTypeEmployer: DeleteTypes = DeleteTypes.EMPLOYER;
  readonly faSurprise = faSurprise;

  constructor() {
    // Watch route params and load employer when ID changes
    effect(() => {
      const params = this.routeParams();
      if (params?.['id']) {
        // Use untracked() to write to signals without creating dependencies
        untracked(() => {
          this.employerId.set(params['id']);
          this.loadEmployer(params['id']);
        });
      }
    });

    // Watch for employer updates from common service
    const createEmployerSignal = toSignal(this.commonService.createEmployerSubject);
    effect(() => {
      const result = createEmployerSignal();
      if (result) {
        const currentId = this.employerId();
        if (currentId) {
          untracked(() => {
            this.loadEmployer(currentId);
            this.modalService.dismissAll();
          });
        }
      }
    });
  }

  private loadEmployer(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.employerService.getSingleEmployer(id).subscribe({
      next: (employer) => {
        this.employer.set(employer);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load employer details');
        this.loading.set(false);
        this.alertService.error('Failed to load employer details');
        console.error('Error loading employer:', err);
      }
    });
  }

  openEditEmployer(content: any): void {
    this.modalService
        .open(content, {
          ariaLabelledBy: 'modal-basic-title',
          size: 'lg'
        })
        .result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
      },
      (reason) => {
        console.log(`Dismissed ${this.getDismissReason(reason)}`);
      }
    );
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
