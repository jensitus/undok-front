import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Employer} from '../model/employer';
import {ClientEmployerJobDescription} from '../model/client-employer-job-description';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ClientEmployerForm} from '../model/client-employer-form';
import {EmployerService} from '../service/employer.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CommonService} from '../../common/services/common.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-edit-client-employer-job-description',
  templateUrl: './edit-client-employer-job-description.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./edit-client-employer-job-description.component.css']
})
export class EditClientEmployerJobDescriptionComponent implements OnInit, OnDestroy {

  @Input() clientEmployerJobDescription: ClientEmployerJobDescription;
  @Input() clientId: string;
  private clientEmployerForm: ClientEmployerForm;
  private unsubscribe$ = new Subject();

  constructor(
    public activeModal: NgbActiveModal,
    private employerService: EmployerService,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
  }

  submit() {
    this.clientEmployerForm = {
      clientId: this.clientId,
      from: this.clientEmployerJobDescription.from,
      industry: this.clientEmployerJobDescription.industry,
      industrySub: this.clientEmployerJobDescription.industrySub,
      jobFunction: this.clientEmployerJobDescription.jobFunction,
      jobRemarks: this.clientEmployerJobDescription.jobRemarks,
      until: this.clientEmployerJobDescription.until,
      employerId: this.clientEmployerJobDescription.employer.id
    };
    this.employerService.updateClientEmployer(this.clientEmployerForm).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      if (result === true) {
        this.commonService.setReloadSubject(true);
      }
    });
  }

}
