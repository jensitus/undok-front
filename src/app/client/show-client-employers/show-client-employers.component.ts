import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EmployerService} from '../service/employer.service';
import {takeUntil} from 'rxjs/operators';
import {Employer} from '../model/employer';
import {Subject} from 'rxjs';
import {CommonService} from '../../common/services/common.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ClientEmployerJobDescription} from '../model/client-employer-job-description';

@Component({
  selector: 'app-show-client-employers',
  templateUrl: './show-client-employers.component.html',
  styleUrls: ['./show-client-employers.component.css']
})
export class ShowClientEmployersComponent implements OnInit, OnDestroy {

  @Input() clientId: string;
  clientEmployerJobDescriptions: ClientEmployerJobDescription[];
  private unsubscribe$ = new Subject();

  constructor(
    private employerService: EmployerService,
    private commonService: CommonService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getEmployersForClient();
    this.getAddEmployerSubject();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  getEmployersForClient() {
    this.employerService.getEmployersForClient(this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      console.log(res);
      this.clientEmployerJobDescriptions = res;
    });
  }

  deleteEmployerFromClient(e_id: string) {
    this.employerService.deleteEmployerFromClient(e_id, this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(r => {
      this.commonService.setEmployerSubject(true);
    });
  }

  getAddEmployerSubject() {
    this.commonService.employerSubject.pipe(takeUntil(this.unsubscribe$)).subscribe(reload => {
      if (reload === true) {
        this.getEmployersForClient();
        this.modalService.dismissAll();
      }
    });
  }

}
