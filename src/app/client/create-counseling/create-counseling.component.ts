import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {CounselingForm} from '../model/counseling-form';
import {takeUntil} from 'rxjs/operators';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import {NgbFormatterService} from '../../common/services/ngb-formatter.service';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-create-counseling',
  templateUrl: './create-counseling.component.html',
  styleUrls: ['./create-counseling.component.css']
})
export class CreateCounselingComponent implements OnInit, OnDestroy {

  @Input() clientId: string;

  private unsubscribe$ = new Subject();
  private loading = false;
  counselingForm: CounselingForm;

  counselingStatus: string;
  entryDate: string;
  concern: string;
  concernCategory: string;
  activity: string;
  activityCategory: string;
  registeredBy: string;
  faBars = faBars;

  constructor(
    private clientService: ClientService,
    private ngbFormatterService: NgbFormatterService,
    private dateAdapter: NgbDateAdapter<string>,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true;
    const theRealDate = this.dateAdapter.fromModel(this.entryDate);
    this.counselingForm = {
      counselingStatus: this.counselingStatus,
      entryDate: this.ngbFormatterService.format(theRealDate),
      concern: this.concern,
      concernCategory: this.concernCategory,
      activity: this.activity,
      activityCategory: this.activityCategory,
      registeredBy: this.registeredBy,
      clientId: this.clientId
    };
    console.log(this.counselingForm);
    this.clientService.createCounseling(this.clientId, this.counselingForm).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log('result', result);
      this.commonService.setCreateCounselingSubject(true);
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

}
