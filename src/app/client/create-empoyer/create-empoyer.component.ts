import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmployerForm} from '../model/employer-form';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CommonService} from '../../common/services/common.service';
import {EmployerService} from '../service/employer.service';

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
  email: string;
  telephone: string;
  employerForm: EmployerForm;


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
    console.log(this.employerForm);
    this.employerService.createEmployer(this.employerForm).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log(result);
      this.commonService.setCreateEmployerSubject(true);
    });
  }

}
