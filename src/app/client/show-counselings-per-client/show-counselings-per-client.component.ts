import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Counseling} from '../model/counseling';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';
import {EditCounselingComponent} from '../edit-counseling/edit-counseling.component';
import {CounselingService} from '../service/counseling.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-show-counselings-per-client',
  templateUrl: './show-counselings-per-client.component.html',
  styleUrls: ['./show-counselings-per-client.component.css']
})
export class ShowCounselingsPerClientComponent implements OnInit, OnDestroy {

  @Input() counselings: Counseling[];
  private closeResult = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private modalService: NgbModal,
    private counselingService: CounselingService,
    private commonService: CommonService
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
    console.log('counselings', this.counselings);
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  openEditCounseling(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowCounselingsPerClientComponent.getDismissReason(reason)}`;
    });
    // const modalRef = this.modalService.open(CreateCounselingComponent);
    // modalRef.componentInstance.name = 'Counseling';
  }

  // openCreateComment(content) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
  //
  //   })
  // }

  openDeleteConfirmationModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowCounselingsPerClientComponent.getDismissReason(reason)}`;
    });
  }

  yes(id: string) {
    this.subscriptions.push(this.counselingService.deleteCounseling(id).subscribe(result => {
      console.log(result);
      this.commonService.setCreateCounselingSubject(true);
    }));
  }

  no() {
    this.modalService.dismissAll();
  }
}
