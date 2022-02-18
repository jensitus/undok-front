import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Counseling} from '../model/counseling';
import {CounselingService} from '../service/counseling.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {DateTimeService} from '../service/date-time.service';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-edit-counseling',
  templateUrl: './edit-counseling.component.html',
  styleUrls: ['./edit-counseling.component.css']
})
export class EditCounselingComponent implements OnInit, OnDestroy {

  @Input() public counseling: Counseling;
  private unsubscribe$ = new Subject();
  faBars = faBars;
  dateObject: NgbDateStruct;
  time = {hour: 13, minute: 30};
  loading = false;

  constructor(
    private counselingService: CounselingService,
    public dateTimeService: DateTimeService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
  }

  onSubmit() {
    this.loading = true;
    this.counselingService.updateCounseling(this.counseling.id, this.counseling).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      console.log(res);
      this.commonService.setCreateCounselingSubject(true);
      this.loading = false;
    });
  }

}
