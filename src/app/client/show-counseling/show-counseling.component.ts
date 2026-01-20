import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CounselingService} from '../service/counseling.service';
import {Subscription} from 'rxjs';
import {CounselingComponent} from '../counseling/counseling.component';
import {SidebarService} from '../../admin-template/shared/services/sidebar.service';

@Component({
  selector: 'app-show-counseling',
  standalone: true,
  templateUrl: './show-counseling.component.html',
  imports: [
    CounselingComponent
  ],
  styleUrls: ['./show-counseling.component.css']
})
export class ShowCounselingComponent implements OnInit, OnDestroy {

  clientId: string;
  counselingId: string;
  private subscription$: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService
    ) {}

  ngOnInit(): void {
    this.subscription$.push(this.activatedRoute.params.subscribe(params => {
      this.clientId = params['client_id'];
      this.counselingId = params['counseling_id'];
      this.sidebarService.setClientIdForCreateCounseling(this.clientId);
    }));
  }

  ngOnDestroy(): void {
    this.sidebarService.setClientIdForCreateCounseling(null);
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

}
