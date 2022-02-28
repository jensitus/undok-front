import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientService} from '../service/client.service';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Client} from '../model/client';
import {Person} from '../model/person';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';
import {Employer} from '../model/employer';
import {SidebarService} from '../../admin-template/shared/services/sidebar.service';

@Component({
  selector: 'app-show-single-client',
  templateUrl: './show-single-client.component.html',
  styleUrls: ['./show-single-client.component.css']
})
export class ShowSingleClientComponent implements OnInit, OnDestroy {

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private sidebarService: SidebarService,
    private router: Router
  ) { }

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
      this.getCreateCounselingSubject();
      this.getDemoSubject();
      this.getCreateEmployerSubject();
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
    console.log('new employer... ', content);
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
    this.subscription$.push(this.clientService.getSingleClient(this.id).subscribe( res => {
      this.client = res;
    }));
  }

  getCreateCounselingSubject()   {
    this.subscription$.push(this.commonService.createCounselingSubject.subscribe( rel => {
      if (rel) {
        this.getClient();
        this.modalService.dismissAll();
      }
    }));
  }

  getDemoSubject() {
    this.subscription$.push(this.commonService.demoSubject.subscribe( reload => {
      if (reload === true) {
        this.getClient();
        this.modalService.dismissAll();
      }
    }));
  }

  getCreateEmployerSubject() {
    this.subscription$.push(this.commonService.createEmployerSubject.subscribe(reload => {
      if (reload === true) {
        this.getClient();
        this.modalService.dismissAll();
      }
    }));
  }

  getReloadClientSubject() {
    this.subscription$.push(this.commonService.reloadClientSubject.subscribe(reload => {
      if (reload === true) {
        // this.getClient();
        this.modalService.dismissAll();
        window.location.reload();
      }
    }));
  }

  checkIfNewCounselingIsNeeded() {
    this.subscription$.push(this.sidebarService.newCounselingSubject.subscribe(newCounseling => {
      if (newCounseling === true) {
        this.openNewCounseling(this.contentCreateCounseling);
        // this.router.navigate(['clients', this.client.id, 'counselings', 'create']);
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
    this.subscription$.push(this.sidebarService.assignEmployerSubject.subscribe(assignEmployer => {
      if (assignEmployer === true) {
        this.openEmployer(this.assignEmployer);
      }
    }));
  }

  checkIfClientIsToBeEdited() {
    console.log('assign .... ');
    this.subscription$.push(this.sidebarService.editClientSubject.subscribe(editClient => {
      if (editClient === true) {
        this.openEditModal(this.editClient);
      }
    }));
  }

}
