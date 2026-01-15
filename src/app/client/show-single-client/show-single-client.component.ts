import {
  Component,
  signal,
  inject,
  computed,
  viewChild,
  TemplateRef,
  ElementRef,
  effect,
  ChangeDetectorRef,
  NgZone,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ModalDismissReasons, NgbAlert, NgbCollapse, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Client } from '../model/client';
import { Person } from '../model/person';
import { Counseling } from '../model/counseling';
import { JoinCategory } from '../model/join-category';
import { DropdownItem } from '../model/dropdown-item';
import { ClientService } from '../service/client.service';
import { CommonService } from '../../common/services/common.service';
import { SidebarService } from '../../admin-template/shared/services/sidebar.service';
import { CategoryService } from '../service/category.service';
import { DurationService } from '../service/duration.service';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import { DeleteTypes } from '../delete/delete-types';
import { Label } from '../model/label';
import { isUndefined } from '../../common/helper/comparison-utils';
import { AlertComponent } from '../../admin-template/layout/components/alert/alert.component';
import { PageHeaderComponent } from '../../admin-template/shared/modules/page-header/page-header.component';
import { ReopenCaseComponent } from '../case/reopen-case/reopen-case.component';
import { ShowClientEmployersComponent } from '../show-client-employers/show-client-employers.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DeleteComponent } from '../delete/delete.component';
import { CaseTaskListComponent } from '../components/tasks/case-task-list/case-task-list.component';
import { ShowCounselingsPerClientComponent } from '../show-counselings-per-client/show-counselings-per-client.component';
import { CloseCaseComponent } from '../case/close-case/close-case.component';
import { CreateCounselingComponent } from '../create-counseling/create-counseling.component';
import { ShowEmployersListComponent } from '../show-employers-list/show-employers-list.component';
import { faEdit, faTachometerAlt, faTasks, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-show-single-client',
  standalone: true,
  templateUrl: './show-single-client.component.html',
  imports: [
    CommonModule,
    NgbAlert,
    AlertComponent,
    PageHeaderComponent,
    ReopenCaseComponent,
    NgbCollapse,
    ShowClientEmployersComponent,
    FaIconComponent,
    DeleteComponent,
    CaseTaskListComponent,
    ShowCounselingsPerClientComponent,
    CloseCaseComponent,
    CreateCounselingComponent,
    ShowEmployersListComponent,
    RouterLink
  ],
  styleUrls: ['./show-single-client.component.css']
})
export class ShowSingleClientComponent implements OnDestroy {
  // Inject services
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly clientService = inject(ClientService);
  private readonly modalService = inject(NgbModal);
  private readonly commonService = inject(CommonService);
  private readonly sidebarService = inject(SidebarService);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly durationService = inject(DurationService);
  private readonly alertService = inject(AlertService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);

  // Signals for state
  alert = signal<boolean>(false);
  autohide = signal<boolean>(true);
  client = signal<Client | undefined>(undefined);
  person = signal<Person | undefined>(undefined);
  counselings = signal<Counseling[] | undefined>(undefined);
  isCollapsed = signal<boolean>(false);
  selectedTaskId = signal<string | undefined>(undefined);
  closeResult = signal<string>('');
  totalCounselingDuration = signal<number>(0);
  totalHumanReadableDuration = signal<string | undefined>(undefined);
  deSelectedItems = signal<DropdownItem[]>([]);
  deSelectedCategories = signal<JoinCategory[]>([]);
  joinCategories = signal<JoinCategory[]>([]);
  joinCategory = signal<JoinCategory | undefined>(undefined);
  private id = signal<string | undefined>(undefined);

  // Computed signals
  reOpenCase = computed(() => {
    const c = this.client();
    return c?.openCase === null && c?.closedCases !== null;
  });

  closeCase = computed(() => {
    const c = this.client();
    return c?.openCase !== null;
  });

  // ViewChild signals
  readonly showTask = viewChild<TemplateRef<any>>('show_task');
  readonly contentCreateCounseling = viewChild<ElementRef>('content_create_counseling');
  readonly createEmployer = viewChild<ElementRef>('create_employer');
  readonly assignEmployer = viewChild<ElementRef>('list_employer');
  readonly editClient = viewChild<ElementRef>('edit_client');
  readonly createTask = viewChild<TemplateRef<any>>('create_task');

  // Constants
  readonly deleteTypeClient: DeleteTypes = DeleteTypes.CLIENT;
  readonly Label = Label;
  readonly faTachometerAlt = faTachometerAlt;
  readonly faUser = faUser;
  readonly faUsers = faUsers;
  readonly faEdit = faEdit;
  readonly faTasks = faTasks;

  private static getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  constructor() {
    // Initialize component
    this.sidebarService.setClientButtons(true);

    // Set up route parameter subscription
    this.activatedRoute.params
        .pipe(takeUntilDestroyed())
        .subscribe(params => {
          this.id.set(params['id']);
          this.getClient();
        });

    // Set up subscriptions
    this.setupSubscriptions();

    // Cleanup effect
    effect(() => {
      return () => {
        this.sidebarService.setClientButtons(false);
      };
    }, { allowSignalWrites: false });
  }

  private setupSubscriptions(): void {
    // Demo signal watcher
    effect(() => {
      if (this.commonService.demo() === true) {
        this.getClient();
        this.modalService.dismissAll();
      }
    });

    // Reload signal watcher
    effect(() => {
      if (this.commonService.reload() === true) {
        this.getClient();
        this.modalService.dismissAll();
      }
    });

    // New counseling signal watcher
    effect(() => {
      if (this.sidebarService.newCounseling() === true) {
        const content = this.contentCreateCounseling();
        if (content) {
          this.openNewCounseling(content);
        }
      }
    });

    // New employer signal watcher
    effect(() => {
      if (this.sidebarService.newEmployer() === true) {
        const employer = this.createEmployer();
        if (employer) {
          this.openEmployer(employer);
        }
      }
    });

    // Assign employer signal watcher
    effect(() => {
      if (this.sidebarService.assignEmployer() === true) {
        const employer = this.assignEmployer();
        if (employer) {
          this.openEmployer(employer);
        }
      }
    });

    // Edit client signal watcher
    effect(() => {
      if (this.sidebarService.editClient()) {
        const c = this.client();
        if (c) {
          this.router.navigate([`clients/${c.id}/edit`]);
        }
      }
    });
  }

  getClient(): void {
    const clientId = this.id();
    if (!clientId) { return; }

    this.clientService
        .getSingleClient(clientId)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (res) => {
            this.ngZone.run(() => {
              this.client.set(res);
              console.log('this.client', res);

              this.alert.set(res.alert === true);
              console.log('alert after assignment:', this.alert());

              this.sidebarService.setClientIdForCreateCounseling(res.id);
              this.getTotalCounselingDuration();
              this.cdr.detectChanges();
            });
          },
          error: (err) => {
            console.error('Error loading client:', err);
          }
        });
  }

  getTotalCounselingDuration(): void {
    let sumOfCounselingDuration = 0;
    const c = this.client();

    if (!isUndefined(c)) {
      for (const counseling of c.counselings) {
        sumOfCounselingDuration += counseling.requiredTime;
      }
    }

    this.totalCounselingDuration.set(sumOfCounselingDuration);

    if (sumOfCounselingDuration > 0) {
      this.totalHumanReadableDuration.set(
        this.durationService.getCounselingDuration(sumOfCounselingDuration)
      );
    }
  }

  openEmployer(content: ElementRef | undefined): void {
    if (!content) { return; }

    this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
        .result.then(
      (result) => {
        this.closeResult.set(`Closed with: ${result}`);
      },
      (reason) => {
        this.closeResult.set(
          `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`
        );
      }
    );
  }

  openCloseCaseModal(close_case: any): void {
    this.modalService
        .open(close_case, { ariaLabelledBy: 'modal-basic-title', size: 'md' })
        .result.then(
      (result) => {
        this.closeResult.set(`Closed with: ${result}`);
      },
      (reason) => {
        this.closeResult.set(
          `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`
        );
      }
    );
  }

  openNewCounseling(content_create_counseling: ElementRef | undefined): void {
    if (!content_create_counseling) { return; }

    this.modalService
        .open(content_create_counseling, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
        .result.then(
      (result) => {
        this.closeResult.set(`Closed with: ${result}`);
      },
      (reason) => {
        this.closeResult.set(
          `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`
        );
      }
    );
  }

  closeOrOpenCase(): void {
    // Reload client to refresh computed signals
    this.getClient();
  }

  closeModal(event: boolean): void {
    if (event) {
      this.modalService.dismissAll();
    }
  }

  closeCaseModal(event: boolean): void {
    if (event) {
      this.modalService.dismissAll();
      this.closeOrOpenCase();
    }
  }

  close(): void {
    this.alert.update(current => !current);
  }

  ngOnDestroy(): void {
    this.sidebarService.setClientButtons(false);
    this.sidebarService.setClientIdForCreateCounseling(null);
  }
}
