import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CounselingService} from '../service/counseling.service';
import {Counseling} from '../model/counseling';
import {CommonService} from '../../common/services/common.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CategoryService} from '../service/category.service';
import {CategoryTypes} from '../model/category-types';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';

@Component({
  selector: 'app-counseling',
  templateUrl: './counseling.component.html',
  styleUrls: ['./counseling.component.css']
})
export class CounselingComponent implements OnInit, OnDestroy {

  @Input() counselingId: string;
  @Input() clientId: string;
  private subscription$: Subscription[] = [];
  counseling: Counseling;
  private closeResult = '';

  constructor(
    private counselingService: CounselingService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private router: Router,
    private alertService: AlertService
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
    this.getCounseling();
    this.getReloadSubject();
    this.getDeleteSubject();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  getCounseling() {
    this.subscription$.push(this.counselingService.getCounseling(this.counselingId).subscribe(counseling => {
      this.counseling = counseling;
      this.subscription$.push(this.categoryService.getCategoriesByTypeAndEntity(
        CategoryTypes.LEGAL, this.counselingId
      ).subscribe(categories => {
        this.counseling.legalCategory = categories;
      }));
    }, error => {
      this.router.navigate(['/clients', this.clientId]);
    }));
  }

  openDeleteConfirmationModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${CounselingComponent.getDismissReason(reason)}`;
    });
  }

  yes(id: string) {
    this.subscription$.push(this.counselingService.deleteCounseling(id).subscribe(result => {
      this.router.navigate(['/clients', this.clientId]);
      this.modalService.dismissAll();
    }, error => {
      this.alertService.error('sorry, that didn\'t work');
    }));
  }

  no() {
    this.modalService.dismissAll();
  }

  openEditCounseling(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${CounselingComponent.getDismissReason(reason)}`;
    });
  }

  getReloadSubject() {
    this.subscription$.push(this.commonService.reloadSubject.subscribe(result => {
      if (result === true) {
        this.getCounseling();
        this.modalService.dismissAll();
      }
    }));
  }

  getDeleteSubject() {
    this.subscription$.push(this.commonService.deleteSubject.subscribe(result => {
      if (result === true) {
        this.router.navigate(['/clients/', this.counseling.clientId]);
      }
    }));
  }

}
