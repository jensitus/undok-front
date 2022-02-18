import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {faBomb, faGraduationCap, faClock, faCheck, faCreditCard} from '@fortawesome/free-solid-svg-icons';
import {ClientService} from '../../../../../client/service/client.service';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

  @Input() user_id: number;
  items: any;
  faBomb = faBomb;
  faGraduationCap = faGraduationCap;
  faClock = faClock;
  faCheck = faCheck;
  faCreditCard = faCreditCard;
  private unsubscribe$: Subscription[] = [];

  constructor(
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.unsubscribe$.push(this.clientService.getItemForTimeline().subscribe(result => {
      this.items = result;
      console.log('this.items', this.items);
    }));
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

}
