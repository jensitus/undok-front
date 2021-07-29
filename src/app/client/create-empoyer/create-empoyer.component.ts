import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmployerForm} from '../model/employer-form';
import {Subject} from 'rxjs';
import {ClientService} from '../service/client.service';
import {takeUntil} from 'rxjs/operators';
import {connectableObservableDescriptor} from 'rxjs/internal/observable/ConnectableObservable';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-create-empoyer',
  templateUrl: './create-empoyer.component.html',
  styleUrls: ['./create-empoyer.component.css']
})
export class CreateEmpoyerComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  employerFirstName: string;
  employerLastName: string;
  employerDateOfBirth: string;
  employerCompany: string;
  employerPosition: string;
  employerForm: EmployerForm;


  constructor(
    private clientService: ClientService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  submit(): void {
    this.employerForm = {
      employerFirstName: this.employerFirstName,
      employerLastName: this.employerLastName,
      employerDateOfBirth: this.employerDateOfBirth,
      employerCompany: this.employerCompany,
      employerPosition: this.employerPosition,
    };
    console.log(this.employerForm);
    this.clientService.createEmployer(this.employerForm).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log(result);
      this.commonService.setCreateEmployerSubject(true);
    });
  }

}
