import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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


@Component({
  selector: 'app-show-single-client',
  templateUrl: './show-single-client.component.html',
  styleUrls: ['./show-single-client.component.css']
})
export class ShowSingleClientComponent implements OnInit, OnDestroy {

  deleteTypeClient: DeleteTypes = DeleteTypes.CLIENT;
  counselings: Counseling[] | undefined;
  private id: string | undefined;
  private subscription$: Subscription[] = [];
  person: Person | undefined;
  client: Client | undefined;
  private closeResult = '';
  public isCollapsed = false;
  @ViewChild('content_create_counseling') contentCreateCounseling: ElementRef | undefined;
  @ViewChild('create_employer') createEmployer: ElementRef | undefined;
  @ViewChild('list_employer') assignEmployer: ElementRef | undefined;
  @ViewChild('edit_client') editClient: ElementRef | undefined;
  faTachometerAlt = faTachometerAlt;
  protected readonly faUser = faUser;
  protected readonly faUsers = faUsers;
  totalCounselingDuration = 0;
  totalHumanReadableDuration: string | undefined;
  protected readonly Label = Label;
  protected closeCase = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private sidebarService: SidebarService,
    private router: Router,
    private categoryService: CategoryService,
    private durationService: DurationService,
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
    if (!isUndefined(this.client)) {
      for (const counseling of this.client.counselings) {
        this.totalCounselingDuration = this.totalCounselingDuration + counseling.requiredTime;
      }
    }
    if (this.totalCounselingDuration > 0) {
      this.totalHumanReadableDuration = this.durationService.getCounselingDuration(this.totalCounselingDuration);
    }
  }

  getClient() {
    this.subscription$.push(
      this.clientService.getSingleClient(this.id).subscribe(res => {
        this.client = res;
        this.getCategories();
        // @ts-ignore
        this.sidebarService.setClientIdForCreateCounselingSubject(this.client.id);
        this.getTotalCounselingDuration();
      })
    );
  }

  getCategories() {
    if (!isUndefined(this.client)) {
      this.client.counselings.forEach((c) => {
        this.subscription$.push(
          this.categoryService.getCategoriesByTypeAndEntity(CategoryTypes.LEGAL, c.id).subscribe({
            next: (categories) => {
              c.legalCategory = categories;
            }
          }));
        this.subscription$.push(
          this.categoryService.getCategoriesByTypeAndEntity(CategoryTypes.ACTIVITY, c.id).subscribe({
            next: (categories) => {
              c.activityCategories = categories;
            }
          }));
      });
    }
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
    this.closeCase = !this.closeCase;
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

}
