import { Component, input, signal, inject, viewChild, viewChildren, effect, ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalDismissReasons, NgbHighlight, NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSurprise } from '@fortawesome/free-solid-svg-icons';
import { Employer } from '../model/employer';
import { EmployerService } from '../service/employer.service';
import { EmployerTableService } from '../table/employer-table.service';
import { NgbdSortableHeader, SortEvent } from '../table/sortable.directive';
import { CommonService } from '../../common/services/common.service';
import { CreateClientEmployerJobDescriptionComponent } from '../create-client-employer-job-description/create-client-employer-job-description.component';
import { SidebarService } from '../../admin-template/shared/services/sidebar.service';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';

@Component({
  selector: 'app-show-employers-list',
  standalone: true,
  imports: [
    NgbPagination,
    FaIconComponent,
    AsyncPipe,
    FormsModule,
    NgbHighlight,
    RouterLink
  ],
  templateUrl: './show-employers-list.component.html',
  styleUrls: ['./show-employers-list.component.css']
})
export class ShowEmployersListComponent {
  // Inject services
  private readonly employerService = inject(EmployerService);
  public readonly employerTableService = inject(EmployerTableService);
  private readonly modalService = inject(NgbModal);
  private readonly commonService = inject(CommonService);
  private readonly sidebarService = inject(SidebarService);
  private readonly alertService = inject(AlertService);

  // Signal-based input
  readonly clientId = input<string>('');

  // ViewChildren and ViewChild as signals
  readonly headers = viewChildren(NgbdSortableHeader);
  readonly createEmployer = viewChild<ElementRef>('create_employer');

  // Observables from service
  total$!: Observable<number>;
  employers$!: Observable<Employer[]>;

  // Font Awesome icon
  readonly faSurprise = faSurprise;

  // Signal for close result
  closeResult = signal<string>('');

  constructor() {
    // Initialize observables
    this.getEmployersPerTableService();

    // Set up effects
    this.setupAlertSubscription();
    this.setupNewEmployerSubscription();

    // Cleanup on destroy
    effect(() => {
      // This runs when component is created
      return () => {
        // This runs on destroy
        this.sidebarService.setCreateEmployerButtonSubject(false);
      };
    }, { allowSignalWrites: false });
  }

  private static getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private setupAlertSubscription(): void {
    this.commonService.alertSubject
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (result) => {
            if (result) {
              this.alertService.success(result, true);
            }
          }
        });
  }

  private setupNewEmployerSubscription(): void {
    this.sidebarService.newEmployerSubject
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (newEmployer) => {
            if (newEmployer === true) {
              const employerElement = this.createEmployer();
              if (employerElement) {
                this.openEmployer(employerElement);
              }
            }
          }
        });
  }

  setEmployer(e_id: string): void {
    const clientIdValue = this.clientId();

    this.employerService
        .checkClientEmployer(e_id, clientIdValue)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (res) => {
            if (res === true) {
              this.deleteEmployer(e_id, clientIdValue);
            } else if (res === false) {
              this.addEmployer(e_id);
            }
          },
          error: (err) => {
            console.error('Error checking client employer:', err);
          }
        });
  }

  deleteEmployer(e_id: string, clientId: string): void {
    this.employerService
        .deleteEmployerFromClient(e_id, clientId)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: () => {
            console.log('Employer deleted successfully');
          },
          error: (err) => {
            console.error('Error deleting employer:', err);
          }
        });
  }

  addEmployer(e_id: string): void {
    const clientIdValue = this.clientId();

    this.employerService
        .setEmployerToClient(e_id, clientIdValue)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: () => {
            this.commonService.setEmployerSubject(true);
          },
          error: (err) => {
            console.error('Error adding employer:', err);
          }
        });
  }

  onSort({ column, direction }: SortEvent): void {
    // Reset other headers
    const headersList = this.headers();
    headersList.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.employerTableService.sortColumn = column;
    this.employerTableService.sortDirection = direction;
  }

  assignEmployer(employer: Employer): void {
    const assignModal = this.modalService.open(
      CreateClientEmployerJobDescriptionComponent,
      { ariaLabelledBy: 'modal-basic-title', size: 'lg' }
    );

    assignModal.componentInstance.employerId = employer.id;
    assignModal.componentInstance.clientId = this.clientId();
    assignModal.componentInstance.company = employer.company;

    assignModal.result.then(
      (result) => {
        this.closeResult.set(`Closed with: ${result}`);
      },
      (reason) => {
        this.closeResult.set(
          `Dismissed ${ShowEmployersListComponent.getDismissReason(reason)}`
        );
      }
    );
  }

  openEmployer(content: any): void {
    this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
        .result.then(
      (result) => {
        this.closeResult.set(`Closed with: ${result}`);
      },
      (reason) => {
        this.closeResult.set(
          `Dismissed ${ShowEmployersListComponent.getDismissReason(reason)}`
        );
      }
    );
  }

  private getEmployersPerTableService(): void {
    this.total$ = this.employerTableService.total$;
    this.employers$ = this.employerTableService.employers$;
  }
}
