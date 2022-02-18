import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ClientEmployerJobDescription} from '../model/client-employer-job-description';
import {Employer} from '../model/employer';
import {EmployerService} from '../service/employer.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';
import {ClientEmployerForm} from '../model/client-employer-form';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-create-client-employer-job-description',
  templateUrl: './create-client-employer-job-description.component.html',
  styleUrls: ['./create-client-employer-job-description.component.css']
})
export class CreateClientEmployerJobDescriptionComponent implements OnInit, OnDestroy {

  @Input() employerId: string;
  @Input() clientId: string;
  @Input() company: string;

  from: string;
  until: string;
  industry: string;
  industrySub: string;
  jobFunction: string;
  jobRemarks: string;
  private unsubscribe$ = new Subject();
  clientEmployerForm: ClientEmployerForm;

  constructor(
    private commonService: CommonService,
    public activeModal: NgbActiveModal,
    private employerService: EmployerService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this.unsubscribe$.next();
  }

  submit() {
    this.clientEmployerForm = {
      employerId: this.employerId,
      clientId: this.clientId,
      industry: this.industry,
      industrySub: this.industrySub,
      jobFunction: this.jobFunction,
      jobRemarks: this.jobRemarks,
      until: this.until,
      from: this.from
    };
    console.log(this.clientEmployerForm);
    this.employerService.createClientEmployer(this.clientEmployerForm).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log(result);
    });
    this.commonService.setReloadClientSubject(true);
  }

}
