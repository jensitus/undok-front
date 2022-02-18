import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {CounselingService} from '../service/counseling.service';
import {takeUntil} from 'rxjs/operators';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.css']
})
export class CreateCommentComponent implements OnInit, OnDestroy {

  @Input() private clientId: string;
  @Input() public comment: string;
  private unsubscribe$ = new Subject();

  constructor(
    private counselingService: CounselingService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this.unsubscribe$.next();
  }

  onSubmit() {
    this.counselingService.createUpdateComment(this.clientId, this.comment).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      console.log(res);
      this.commonService.setReloadClientSubject(true);
    });
  }

}
