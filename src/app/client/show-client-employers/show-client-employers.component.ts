import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EmployerService} from '../service/employer.service';
import {takeUntil} from 'rxjs/operators';
import {Employer} from '../model/employer';
import {Subject} from 'rxjs';
import {CommonService} from '../../common/services/common.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ClientEmployerJobDescription} from '../model/client-employer-job-description';
import {CreateClientEmployerJobDescriptionComponent} from '../create-client-employer-job-description/create-client-employer-job-description.component';
import {EditClientEmployerJobDescriptionComponent} from '../edit-client-employer-job-description/edit-client-employer-job-description.component';

@Component({
  selector: 'app-show-client-employers',
  templateUrl: './show-client-employers.component.html',
  styleUrls: ['./show-client-employers.component.css']
})
export class ShowClientEmployersComponent implements OnInit, OnDestroy {

  @Input() clientId: string;
  clientEmployerJobDescriptions: ClientEmployerJobDescription[];
  private unsubscribe$ = new Subject();
  private closeResult: string;
  public isCollapsed = true;

  constructor(
    private employerService: EmployerService,
    private commonService: CommonService,
    private modalService: NgbModal
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
    this.getEmployersForClient();
    this.getAddEmployerSubject();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
  }

  getEmployersForClient() {
    this.employerService.getEmployersForClient(this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      console.log(res);
      this.clientEmployerJobDescriptions = res;
    });
  }

  deleteEmployerFromClient(e_id: string) {
    this.employerService.deleteEmployerFromClient(e_id, this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(r => {
      this.commonService.setEmployerSubject(true);
    });
  }

  getAddEmployerSubject() {
    this.commonService.employerSubject.pipe(takeUntil(this.unsubscribe$)).subscribe(reload => {
      if (reload === true) {
        this.getEmployersForClient();
        this.modalService.dismissAll();
      }
    });
  }

  edit(clientEmployerJobDescription: ClientEmployerJobDescription) {
    const assignModal = this.modalService.open(EditClientEmployerJobDescriptionComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    assignModal.componentInstance.clientEmployerJobDescription = clientEmployerJobDescription;
    assignModal.componentInstance.clientId = this.clientId;
    assignModal.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowClientEmployersComponent.getDismissReason(reason)}`;
    });
  }

}
