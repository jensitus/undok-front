import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CounselingService} from '../service/counseling.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-show-counseling',
  templateUrl: './show-counseling.component.html',
  styleUrls: ['./show-counseling.component.css']
})
export class ShowCounselingComponent implements OnInit, OnDestroy {

  clientId: string;
  counselingId: string;
  private subscription$: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.subscription$.push(this.activatedRoute.params.subscribe(params => {
      this.clientId = params['client_id'];
      this.counselingId = params['counseling_id'];
    }));
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

}
