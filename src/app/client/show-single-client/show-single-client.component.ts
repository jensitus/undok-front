import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientService} from '../service/client.service';
import {Subscription} from 'rxjs';
import {Client} from '../model/client';
import {Person} from '../model/person';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';
import {SidebarService} from '../../admin-template/shared/services/sidebar.service';
import {DeleteTypes} from '../delete/delete-types';
import {CategoryTypes} from '../model/category-types';
import {Counseling} from '../model/counseling';
import {CategoryService} from '../service/category.service';
import {faTachometerAlt, faUser, faUsers} from '@fortawesome/free-solid-svg-icons';
import {isUndefined} from '../../common/helper/comparison-utils';
import {DurationService} from '../service/duration.service';
import {Label} from '../model/label';
import {DropdownItem} from '../model/dropdown-item';
import {JoinCategory} from '../model/join-category';
import {EntityTypes} from '../model/entity-types';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {Task} from '../model/task';


@Component({
  selector: 'app-show-single-client',
  templateUrl: './show-single-client.component.html',
  styleUrls: ['./show-single-client.component.css']
})
export class ShowSingleClientComponent implements OnInit, OnDestroy {

  show = false;
  autohide = true;

  deleteTypeClient: DeleteTypes = DeleteTypes.CLIENT;
  counselings: Counseling[] | undefined;
  private id: string | undefined;
  private subscription$: Subscription[] = [];
  person: Person | undefined;
  client: Client | undefined;
  private closeResult = '';
  public isCollapsed = false;
  selectedTaskId: string | undefined;
  @ViewChild('show_task') showTask: TemplateRef<any> | undefined;
  @ViewChild('content_create_counseling') contentCreateCounseling: ElementRef | undefined;
  @ViewChild('create_employer') createEmployer: ElementRef | undefined;
  @ViewChild('list_employer') assignEmployer: ElementRef | undefined;
  @ViewChild('edit_client') editClient: ElementRef | undefined;
  @ViewChild('create_task') createTask: TemplateRef<any> | undefined;
  faTachometerAlt = faTachometerAlt;
  protected readonly faUser = faUser;
  protected readonly faUsers = faUsers;
  totalCounselingDuration = 0;
  totalHumanReadableDuration: string | undefined;
  protected readonly Label = Label;
  protected reOpenCase = false;
  protected closeCase = false;
  deSelectedItems: DropdownItem[] = [];
  private deSelectedCategories: JoinCategory[] = [];
  private joinCategories: JoinCategory[] = [];
  private joinCategory: JoinCategory;

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private sidebarService: SidebarService,
    private router: Router,
    private categoryService: CategoryService,
    private durationService: DurationService,
    private alertService: AlertService,
  ) {
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

  ngOnInit(): void {
    this.subscription$.push(
      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
        this.getClient();
        this.getDemoSubject();
        // this.getCreateEmployerSubject();
        this.getReloadClientSubject();
        this.checkIfNewCounselingIsNeeded();
        this.checkIfNewEmployerIsNeeded();
        this.checkIfEmployerIsToBeAssigned();
        this.checkIfClientIsToBeEdited();
      }))
    ;
    this.sidebarService.setClientButtonSubject(true);
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.forEach((s) => {
        s.unsubscribe();
      });
    }
    this.sidebarService.setClientButtonSubject(false);
  }

  openEmployer(content: ElementRef | undefined) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`;
    });
  }

  openCloseCaseModal(close_case: any) {
    this.modalService.open(close_case, {ariaLabelledBy: 'modal-basic-title', size: 'md'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`;
    });
  }

  openNewCounseling(content_create_counseling: ElementRef | undefined) {
    this.modalService.open(content_create_counseling, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`;
    });
  }

  getTotalCounselingDuration() {
    let sumOfCounselingDuration = 0;
    if (!isUndefined(this.client)) {
      for (const counseling of this.client.counselings) {
        sumOfCounselingDuration = sumOfCounselingDuration + counseling.requiredTime;
      }
    }
    this.totalCounselingDuration = sumOfCounselingDuration;
    if (this.totalCounselingDuration > 0) {
      this.totalHumanReadableDuration = this.durationService.getCounselingDuration(this.totalCounselingDuration);
    }
  }

  getClient() {
    this.subscription$.push(
      this.clientService.getSingleClient(this.id).subscribe(res => {
        this.client = res;
        if (this.client.openCase === null && this.client.closedCases !== null) {
          this.reOpenCase = true;
        } else if (this.client.openCase === null && this.client.closedCases === null) {
          this.reOpenCase = false;
        }
        if (this.client.openCase !== null) {
          this.closeCase = true;
        }
        if (this.client.alert === true) {
          this.show = true;
        }
        // @ts-ignore
        this.sidebarService.setClientIdForCreateCounselingSubject(this.client.id);
        this.getTotalCounselingDuration();
      })
    );
  }

  getDemoSubject() {
    this.subscription$.push(this.commonService.demoSubject.subscribe(reload => {
      if (reload === true) {
        this.getClient();
        this.modalService.dismissAll();
      }
    }));
  }

  getReloadClientSubject() {
    this.subscription$.push(this.commonService.reloadSubject.subscribe(reload => {
      if (reload === true) {
        this.getClient();
        this.modalService.dismissAll();
      }
    }));
  }

  checkIfNewCounselingIsNeeded() {
    this.subscription$.push(this.sidebarService.newCounselingSubject.subscribe(newCounseling => {
      if (newCounseling === true) {
        this.openNewCounseling(this.contentCreateCounseling);
      }
    }));
  }

  checkIfNewEmployerIsNeeded() {
    this.subscription$.push(this.sidebarService.newEmployerSubject.subscribe(newEmployer => {
      if (newEmployer === true) {
        this.openEmployer(this.createEmployer);
      }
    }));
  }

  checkIfEmployerIsToBeAssigned() {
    this.subscription$.push(
      this.sidebarService.assignEmployerSubject.subscribe({
          next: (assignEmployer) => {
            if (assignEmployer === true) {
              this.openEmployer(this.assignEmployer);
            }
          }
        }
      )
    );
  }

  checkIfClientIsToBeEdited() {
    if (!isUndefined(this.client)) {
      const clientId = this.client.id;
      this.subscription$.push(
        this.sidebarService.editClientSubject.subscribe(editClient => {
          if (editClient) {
            this.router.navigate([`clients/${clientId}/edit`]).then();
          }
        })
      );
    }
  }

  closeOrOpenCase(): void {
    this.reOpenCase = !this.reOpenCase;
  }

  closeModal(event: boolean) {
    if (event) {
      this.modalService.dismissAll();
    }
  }

  closeCaseModal(event: boolean) {
    if (event) {
      this.modalService.dismissAll();
      this.closeOrOpenCase();
    }
  }

  // openJobFunctionModal(job_function: TemplateRef<any>) {
  //   this.modalService.open(job_function, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`;
  //   });
  // }

  openTargetGroupModal(target_group: TemplateRef<any>) {
    this.modalService.open(target_group, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`;
    });
  }

  showCategoryValue(event: DropdownItem[], categoryType: CategoryTypes) {
    this.joinCategories = [];
    event.forEach(e => {
      this.joinCategory = {
        categoryId: e.itemId,
        categoryType: categoryType,
        entityId: this.client.id,
        entityType: EntityTypes.CLIENT
      };
      this.joinCategories.push(this.joinCategory);
    });
  }

  showDeSelected(event: DropdownItem[]) {
    this.deSelectedItems = event;
  }

  saveCategories(categoryType: CategoryTypes) {
      this.deSelectedItems.forEach((deSelected) => {
        const deselect: JoinCategory = {
          entityType: EntityTypes.CLIENT,
          entityId: this.client.id,
          categoryType: categoryType,
          categoryId: deSelected.itemId
        };
        this.deSelectedCategories.push(deselect);
      });
      this.subscription$.push(
        this.categoryService.deleteJoinCategories(this.deSelectedCategories).subscribe({
          next: () => {

          }, error: (error) => {
            console.log(error);
          }
        })
      );
      this.subscription$.push(
        this.categoryService.addJoinCategories(this.joinCategories).subscribe(join => {
          this.commonService.setReloadSubject(true);
        })
      );
      this.deSelectedCategories = [];
      this.joinCategories = [];
  }

  close() {
    this.show = !this.show;
    // setTimeout(() => (this.show = true), 3000);
  }

  openCreateTaskModal(content: any): void {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`;
    });
  }

  onTaskCreated(task: Task, modal: any): void {
    console.log('Task created:', task);
    modal.close('Task created');
    // Optional: Show success message, refresh list, etc.
    this.alertService.success('Task created successfully');
    // Optional: Refresh task list if you have one
    this.getClient(); // Refresh client data if needed
  }

  onTaskUpdated(task: Task, modal: any): void {
    console.log('Task updated:', task);
    this.alertService.success('Task updated successfully');
    modal.close('Task updated');
    // Refresh your task list if needed
  }

  onTaskDeleted(taskId: number, modal: any): void {
    console.log('Task deleted:', taskId);
    this.alertService.success('Task deleted successfully');
    modal.close('Task deleted');
    // Refresh your task list if needed
  }

}
