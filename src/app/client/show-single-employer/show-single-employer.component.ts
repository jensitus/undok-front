import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EmployerService} from '../service/employer.service';
import {Subscription} from 'rxjs';
import {Employer} from '../model/employer';
import {faSurprise} from '@fortawesome/free-solid-svg-icons';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-show-single-employer',
  templateUrl: './show-single-employer.component.html',
  styleUrls: ['./show-single-employer.component.css']
})
export class ShowSingleEmployerComponent implements OnInit, OnDestroy {

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private employerService: EmployerService,
    private commonService: CommonService
  ) {
  }

  private subscription$: Subscription[] = [];
  private id: string;
  employer: Employer;
  faSurprise = faSurprise;
  private closeResult: string;

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
      this.getEmployer(this.id);
    }));
    this.getCreateEmployerSubject();
  }

  getEmployer(id: string): void {
    this.subscription$.push(this.employerService.getSingleEmployer(id).subscribe((employer) => {
      this.employer = employer;
    }));
  }

  openEditEmployer(content_edit_employer) {
    this.modalService.open(content_edit_employer, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowSingleEmployerComponent.getDismissReason(reason)}`;
    });
  }

  getCreateEmployerSubject() {
    this.commonService.createEmployerSubject.subscribe(result => {
      if (result) {
        this.getEmployer(this.id);
        this.modalService.dismissAll();
      }
    })
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

}
