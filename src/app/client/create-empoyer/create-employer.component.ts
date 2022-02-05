import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmployerForm} from '../model/employer-form';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CommonService} from '../../common/services/common.service';
import {EmployerService} from '../service/employer.service';

@Component({
  selector: 'app-create-employer',
  templateUrl: './create-employer.component.html',
  styleUrls: ['./create-employer.component.css']
})
export class CreateEmployerComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  employerFirstName: string;
  employerLastName: string;
  employerDateOfBirth: string;
  employerCompany: string;
  employerPosition: string;
  email: string;
  telephone: string;
  employerForm: EmployerForm;
  loading = false;


  constructor(
    private commonService: CommonService,
    private employerService: EmployerService
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
      employerTelephone: this.telephone,
      employerEmail: this.email
    };
    this.loading = true;
    console.log(this.employerForm);
    this.employerService.createEmployer(this.employerForm).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log(result);
      this.commonService.setCreateEmployerSubject(true);
    });
  }

}
