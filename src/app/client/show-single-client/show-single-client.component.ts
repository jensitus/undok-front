import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Client} from '../model/client';
import {Person} from '../model/person';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private modalService: NgbModal,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.id = params['id'];
      this.getClient();
      this.getCreateCounselingSubject();
      this.getDemoSubject();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  openNewCounseling(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    // const modalRef = this.modalService.open(CreateCounselingComponent);
    // modalRef.componentInstance.name = 'Counseling';
  }

  openEditModal(edit_client) {
    this.modalService.open(edit_client, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getClient() {
    this.clientService.getSingleClient(this.id).pipe(takeUntil(this.unsubscribe$)).subscribe( res => {
      this.person = res;
      console.log(this.person);
    });
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
    })
  }

}
