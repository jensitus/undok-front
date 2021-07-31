import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EmployerService} from '../service/employer.service';
import {takeUntil} from 'rxjs/operators';
import {Employer} from '../model/employer';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-show-client-employers',
  templateUrl: './show-client-employers.component.html',
  styleUrls: ['./show-client-employers.component.css']
})
export class ShowClientEmployersComponent implements OnInit, OnDestroy {

  @Input() clientId: string;
  employers: Employer[];
  private unsubscribe$ = new Subject();

  constructor(
    private employerService: EmployerService
  ) { }

  ngOnInit(): void {
    this.getEmployersForClient();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  getEmployersForClient() {
    this.employerService.getEmployersForClient(this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.employers = res;
    });
  }

}
