import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {CounselingForm} from '../model/counseling-form';
import {takeUntil} from 'rxjs/operators';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {NgbDateAdapter, NgbDateStruct, NgbTimepicker} from '@ng-bootstrap/ng-bootstrap';
import {NgbFormatterService} from '../../common/services/ngb-formatter.service';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-create-counseling',
  templateUrl: './create-counseling.component.html',
  styleUrls: ['./create-counseling.component.css']
})
export class CreateCounselingComponent implements OnInit, OnDestroy {

  @Input() clientId: string;

  time = {hour: 13, minute: 30};
  dateObject: NgbDateStruct;

  private unsubscribe$ = new Subject();
  loading = false;
  counselingForm: CounselingForm;

  counselingStatus: string;
  entryDate: string;
  counselingDate: string;
  counselingTime: string;
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
    this.counselingDate = this.mergeDateAndTime();
    this.counselingForm = {
      counselingStatus: this.counselingStatus,
      entryDate: this.ngbFormatterService.format(theRealDate),
      concern: this.concern,
      concernCategory: this.concernCategory,
      activity: this.activity,
      activityCategory: this.activityCategory,
      registeredBy: this.registeredBy,
      clientId: this.clientId,
      counselingDate: this.counselingDate
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

  mergeDateAndTime(): string {
    let day = '';
    let month = '';
    if (this.dateObject.day.toString().length === 1) {
    day = '0' + this.dateObject.day;
    } else {
      day = this.dateObject.day.toString();
    }
    if (this.dateObject.month.toString().length === 1) {
      month = '0' + this.dateObject.month;
    } else {
      month = this.dateObject.month.toString();
    }
    const finalDateTimeDonner = day + '-' + month + '-' + this.dateObject.year + ' ' + this.time.hour + ':' + this.time.minute;
    console.log(finalDateTimeDonner);
    return finalDateTimeDonner;
  }

}
