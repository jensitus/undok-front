import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Counseling} from '../model/counseling';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';
import {CounselingService} from '../service/counseling.service';
import {Subscription} from 'rxjs';
import {DurationService} from '../service/duration.service';

@Component({
  selector: 'app-show-counselings-per-client',
  templateUrl: './show-counselings-per-client.component.html',
  styleUrls: ['./show-counselings-per-client.component.css']
})
export class ShowCounselingsPerClientComponent implements OnInit, OnDestroy {


  constructor(
    private modalService: NgbModal,
    private counselingService: CounselingService,
    private commonService: CommonService,
    public durationService: DurationService,
  ) {
  }

  counselings: Counseling[];
  @Input() clientId: string;
  private closeResult = '';
  private subscriptions: Subscription[] = [];

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
    this.getCreateCounselingSubject();
    this.getCounselingsByClientId();
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  getCounselingDuration(requiredTime: number): string {
    return this.durationService.getCounselingDuration(requiredTime);
  }

  getCreateCounselingSubject() {
    this.subscriptions.push(this.commonService.createCounselingSubject.subscribe((counselingSubject) => {
      if (counselingSubject === true) {
        this.modalService.dismissAll();
      }
    }));
  }

  openEditCounseling(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowCounselingsPerClientComponent.getDismissReason(reason)}`;
    });
  }

  yes(id: string) {
    this.subscriptions.push(this.counselingService.deleteCounseling(id).subscribe(result => {
      this.commonService.setCreateCounselingSubject(true);
    }));
  }

  no() {
    this.modalService.dismissAll();
  }

  closeCommentModal() {
    this.getCounselingsByClientId();
    this.modalService.dismissAll();
  }

  getCounselingsByClientId() {
    this.subscriptions.push(
      this.counselingService.getCounselingsByClientId(this.clientId).subscribe({
        next: (counselings) => {
          this.counselings = counselings;
        }, error: err => {
          console.log(err);
        }
      })
    );
  }

}
