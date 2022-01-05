import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
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
  private unsubscribe$ = new Subject();
  person: Person;
  client: Client;
  private closeResult = '';
  public isCollapsed = false;
  @ViewChild('content') contentCreateCounseling: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private sidebarService: SidebarService
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
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.id = params['id'];
      this.getClient();
      this.getCreateCounselingSubject();
      this.getDemoSubject();
      this.getCreateEmployerSubject();
      this.getReloadClientSubject();
      this.checkIfNewCounselingIsNeeded();
    });
    this.sidebarService.setClientButtonSubject(true);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.sidebarService.setClientButtonSubject(false);
  }

  openEmployer(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`;
    });
  }

  openNewCounseling(content) {
    console.log('open this modal?');
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
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
    this.clientService.getSingleClient(this.id).pipe(takeUntil(this.unsubscribe$)).subscribe( res => {
      this.client = res;
      console.log(this.client);
    });
  }

  getCreateCounselingSubject()   {
    this.commonService.createCounselingSubject.pipe(takeUntil(this.unsubscribe$)).subscribe( rel => {
      if (rel) {
        this.getClient();
        this.modalService.dismissAll();
      }
    });
  }

  getDemoSubject() {
    this.commonService.demoSubject.pipe(takeUntil(this.unsubscribe$)).subscribe( reload => {
      if (reload === true) {
        this.getClient();
        this.modalService.dismissAll();
      }
    });
  }

  getCreateEmployerSubject() {
    this.commonService.createEmployerSubject.pipe(takeUntil(this.unsubscribe$)).subscribe(reload => {
      if (reload === true) {
        this.getClient();
        this.modalService.dismissAll();
      }
    });
  }

  getReloadClientSubject() {
    this.commonService.reloadClientSubject.pipe(takeUntil(this.unsubscribe$)).subscribe(reload => {
      if (reload === true) {
        this.getClient();
        this.modalService.dismissAll();
      }
    });
  }

  checkIfNewCounselingIsNeeded() {
    this.sidebarService.newCounselingSubject.pipe(takeUntil(this.unsubscribe$)).subscribe(newCounseling => {
      if (newCounseling === true) {
        this.openNewCounseling(this.contentCreateCounseling);
      }
    });
  }

}
