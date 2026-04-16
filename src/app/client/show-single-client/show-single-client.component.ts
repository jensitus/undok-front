import {ChangeDetectorRef, Component, computed, effect, ElementRef, inject, NgZone, OnDestroy, signal, untracked, viewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule} from '@angular/common';
import {ModalDismissReasons, NgbAlert, NgbCollapse, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Client} from '../model/client';
import {Counseling} from '../model/counseling';
import {ClientService} from '../service/client.service';
import {CommonService} from '../../common/services/common.service';
import {SidebarService} from '../../admin-template/shared/services/sidebar.service';
import {DurationService} from '../service/duration.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {TaskService} from '../service/task.service';
import {DeleteTypes} from '../delete/delete-types';
import {Label} from '../model/label';
import {AlertComponent} from '../../admin-template/layout/components/alert/alert.component';
import {PageHeaderComponent} from '../../admin-template/shared/page-header/page-header.component';
import {ReopenCaseComponent} from '../case/reopen-case/reopen-case.component';
import {ShowClientEmployersComponent} from '../show-client-employers/show-client-employers.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {DeleteComponent} from '../delete/delete.component';
import {CaseTaskListComponent} from '../components/tasks/case-task-list/case-task-list.component';
import {ShowCounselingsPerClientComponent} from '../show-counselings-per-client/show-counselings-per-client.component';
import {CloseCaseComponent} from '../case/close-case/close-case.component';
import {CreateCounselingComponent} from '../create-counseling/create-counseling.component';
import {ShowEmployersListComponent} from '../show-employers-list/show-employers-list.component';
import {
  faEdit, faTachometerAlt, faTasks, faUsers,
  faUser, faEnvelope, faPhone, faMapMarkerAlt, faFlag, faVenusMars, faComment, faAddressBook,
  faBriefcase, faExclamationTriangle, faClock,
  faBan, faIdCard, faShieldAlt, faLanguage, faTools, faComments, faKey,
  faBullhorn, faUserSecret, faGavel, faIndustry, faLayerGroup
} from '@fortawesome/free-solid-svg-icons';

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
  private readonly durationService = inject(DurationService);
  private readonly taskService = inject(TaskService);
  private readonly alertService = inject(AlertService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);

  // Signals for state
  alert = signal<boolean>(false);
  client = signal<Client | undefined>(undefined);
  private id = signal<string | undefined>(undefined);
  counselings = signal<Counseling[] | undefined>(undefined);
  isCollapsed = signal<boolean>(false);
  isCollapsedCase = signal<boolean>(true);
  closeResult = signal<string>('');

  // Computed signals
  readonly totalHumanReadableDuration = computed(() => {
    const counselingMinutes = (this.client()?.counselings ?? [])
      .reduce((sum, c) => sum + (c.requiredTime ?? 0), 0);
    const taskMinutes = this.taskService.tasks()
                            .reduce((sum, t) => sum + (t.requiredTime ?? 0), 0);
    const total = counselingMinutes + taskMinutes;
    return total > 0 ? this.durationService.getCounselingDuration(total) : undefined;
  });

  readonly hasCaseContent = computed(() => {
    const c = this.client();
    if (!c) return false;
    const oc = c.openCase;
    return !!(
      oc?.workingRelationship ||
      oc?.humanTrafficking !== null && oc?.humanTrafficking !== undefined ||
      oc?.jobCenterBlock !== null && oc?.jobCenterBlock !== undefined ||
      c.currentResidentStatus ||
      c.vulnerableWhenAssertingRights !== null && c.vulnerableWhenAssertingRights !== undefined ||
      oc?.targetGroup ||
      c.interpreterNecessary !== null && c.interpreterNecessary !== undefined ||
      oc?.jobFunction?.length > 0 ||
      oc?.counselingLanguages?.length > 0 ||
      oc?.jobMarketAccess?.length > 0 ||
      oc?.originOfAttention?.length > 0 ||
      oc?.undocumentedWork?.length > 0 ||
      oc?.complaints?.length > 0 ||
      oc?.industryUnion?.length > 0 ||
      oc?.sector?.length > 0
    );
  });

  reOpenCase = computed(() => {
    const c = this.client();
    return c?.openCase === null && c?.closedCases !== null;
  });

  closeCase = computed(() => {
    const c = this.client();
    return c?.openCase !== null;
  });

  // ViewChild signals
  // readonly showTask = viewChild<TemplateRef<any>>('show_task');
  readonly contentCreateCounseling = viewChild<ElementRef>('content_create_counseling');
  readonly createEmployer = viewChild<ElementRef>('create_employer');
  readonly assignEmployer = viewChild<ElementRef>('list_employer');

  // Constants
  readonly deleteTypeClient: DeleteTypes = DeleteTypes.CLIENT;
  readonly Label = Label;
  readonly faTachometerAlt = faTachometerAlt;
  readonly faUsers = faUsers;
  readonly faEdit = faEdit;
  readonly faTasks = faTasks;
  readonly faUser = faUser;
  readonly faEnvelope = faEnvelope;
  readonly faPhone = faPhone;
  readonly faMapMarkerAlt = faMapMarkerAlt;
  readonly faFlag = faFlag;
  readonly faVenusMars = faVenusMars;
  readonly faComment = faComment;
  readonly faAddressBook = faAddressBook;
  readonly faBriefcase = faBriefcase;
  readonly faExclamationTriangle = faExclamationTriangle;
  readonly faClock = faClock;
  readonly faBan = faBan;
  readonly faIdCard = faIdCard;
  readonly faShieldAlt = faShieldAlt;
  readonly faLanguage = faLanguage;
  readonly faTools = faTools;
  readonly faComments = faComments;
  readonly faKey = faKey;
  readonly faBullhorn = faBullhorn;
  readonly faUserSecret = faUserSecret;
  readonly faGavel = faGavel;
  readonly faIndustry = faIndustry;
  readonly faLayerGroup = faLayerGroup;

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
    }, {allowSignalWrites: false});
  }

  private setupSubscriptions(): void {
    // Collapse personal info card automatically based on whether data is present
    effect(() => {
      const c = this.client();
      if (c) {
        const hasPersonalInfo = !!(c.email || c.telephone || c.city || c.nationality || c.gender || c.furtherContact || c.comment);
        untracked(() => this.isCollapsed.set(!hasPersonalInfo));
      }
    });

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
    if (!clientId) {
      return;
    }

    this.clientService
        .getSingleClient(clientId)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (res) => {
            this.ngZone.run(() => {
              this.client.set(res);
              this.isCollapsedCase.set(!this.hasCaseContent());
              console.log('this.client', res);

              this.alert.set(res.alert === true);
              console.log('alert after assignment:', this.alert());

              this.sidebarService.setClientIdForCreateCounseling(res.id);
              this.cdr.detectChanges();
            });
          },
          error: (err) => {
            console.error('Error loading client:', err);
          }
        });
  }

  openEmployer(content: ElementRef | undefined): void {
    if (!content) {
      return;
    }

    this.modalService
        .open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'})
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
        .open(close_case, {ariaLabelledBy: 'modal-basic-title', size: 'md'})
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
    if (!content_create_counseling) {
      return;
    }

    this.modalService
        .open(content_create_counseling, {ariaLabelledBy: 'modal-basic-title', size: 'lg'})
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
    this.sidebarService.setAssignEmployer(false);
  }
}
