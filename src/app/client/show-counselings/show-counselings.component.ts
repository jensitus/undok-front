import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Counseling} from '../model/counseling';

@Component({
  selector: 'app-show-counselings',
  templateUrl: './show-counselings.component.html',
  styleUrls: ['./show-counselings.component.css']
})
export class ShowCounselingsComponent implements OnInit, OnDestroy {

  counselings: Counseling[];
  private unsubscribe$ = new Subject();

  constructor(
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.clientService.getCounselings().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      this.counselings = result;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

}
