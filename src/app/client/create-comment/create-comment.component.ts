import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
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
  @Input() public delete = false;
  @Output() public commentSaved: EventEmitter<boolean> = new EventEmitter();
  private unsubscribe$: Subscription[] = [];

  constructor(
    private counselingService: CounselingService,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  onSubmit() {
    this.unsubscribe$.push(
      this.counselingService.createUpdateComment(this.clientId, this.comment).subscribe({
        next: () => {
          this.commentSaved.emit(true);
        }
      })
    );
  }

  deleteComment() {
    this.comment = 'null';
    this.unsubscribe$.push(this.counselingService.createUpdateComment(this.clientId, this.comment).subscribe(res => {
      this.commonService.setReloadSubject(true);
    }));
  }
}
