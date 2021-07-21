import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Counseling} from '../model/counseling';
import {faTasks} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-show-counselings',
  templateUrl: './show-counselings.component.html',
  styleUrls: ['./show-counselings.component.css']
})
export class ShowCounselingsComponent implements OnInit, OnDestroy {

  counselings: Counseling[];
  private unsubscribe$ = new Subject();
  faTasks = faTasks;

  constructor(
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.clientService.getCounselings().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log(result);
      this.counselings = result;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

}
