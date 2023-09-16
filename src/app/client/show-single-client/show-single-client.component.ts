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
import {faEarListen, faBars, faCampground, faCoffee, faPowerOff, faTachometerAlt, faUser, faUsers, faTasks, faSurprise, faSave} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-show-single-client',
  templateUrl: './show-single-client.component.html',
  styleUrls: ['./show-single-client.component.css']
})
export class ShowSingleClientComponent implements OnInit, OnDestroy {

  deleteTypeClient: DeleteTypes = DeleteTypes.CLIENT;
  counselings: Counseling[];
  private id: string;
  private subscription$: Subscription[] = [];
  person: Person;
  client: Client;
  private closeResult = '';
  public isCollapsed = false;
  @ViewChild('content_create_counseling') contentCreateCounseling: ElementRef;
  @ViewChild('create_employer') createEmployer: ElementRef;
  @ViewChild('list_employer') assignEmployer: ElementRef;
  @ViewChild('edit_client') editClient: ElementRef;
  faTachometerAlt = faTachometerAlt;
  protected readonly faUser = faUser;

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private sidebarService: SidebarService,
    private router: Router,
    private categoryService: CategoryService
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
    this.subscription$.push(this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.getClient();
      this.getDemoSubject();
      // this.getCreateEmployerSubject();
      this.getReloadClientSubject();
      this.checkIfNewCounselingIsNeeded();
      this.checkIfNewEmployerIsNeeded();
      this.checkIfEmployerIsToBeAssigned();
      this.checkIfClientIsToBeEdited();
    }));
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

  openEmployer(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`;
    });
  }

  openNewCounseling(content_create_counseling) {
    this.modalService.open(content_create_counseling, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`;
    });
  }

  openEditModal(edit_client) {
    this.modalService.open(edit_client, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`;
    });
  }

  getClient() {
    this.subscription$.push(this.clientService.getSingleClient(this.id).subscribe(res => {
      this.client = res;
      this.getCategories();
      this.sidebarService.setClientIdForCreateCounselingSubject(this.client.id);
    }));
  }

  getCategories() {
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
    this.subscription$.push(
      this.sidebarService.editClientSubject.subscribe(editClient => {
        if (editClient === true) {
          this.router.navigate([`clients/${this.client.id}/edit`]);
        }
      })
    );
  }

  protected readonly faUsers = faUsers;
}
