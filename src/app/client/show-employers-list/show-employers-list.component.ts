import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Employer} from '../model/employer';
import {EmployerService} from '../service/employer.service';

@Component({
  selector: 'app-show-employers-list',
  templateUrl: './show-employers-list.component.html',
  styleUrls: ['./show-employers-list.component.css']
})
export class ShowEmployersListComponent implements OnInit, OnDestroy {

  @Input() clientId: string;
  private unsubscribe$ = new Subject();
  employers: Employer[];

  constructor(
    private employerService: EmployerService
  ) {
  }

  ngOnInit(): void {
    this.getEmployerList();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  getEmployerList(): any {
    this.employerService.getAllEmployers().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      this.employers = result;
      console.log(this.employers);
    });
  }

  setEmployer(e_id) {
    this.employerService.checkClientEmployer(e_id, this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      console.log(res);
      if (res === true) {
        this.deleteEmployer(e_id, this.clientId);
      } else if (res === false) {
        this.addEmployer(e_id, this.clientId);
      }
    });
  }

  deleteEmployer(e_id: string, clientId: string) {
    this.employerService.deleteEmployerFromClient(e_id, this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(r => {
      console.log(r);
    });
  }

  addEmployer(e_id: string, clientId: string) {
    this.employerService.setEmployerToClient(e_id, this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(r => {
      console.log(r);
    });
  }


}
