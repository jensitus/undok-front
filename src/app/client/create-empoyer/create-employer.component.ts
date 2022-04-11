import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmployerForm} from '../model/employer-form';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CommonService} from '../../common/services/common.service';
import {EmployerService} from '../service/employer.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-create-employer',
  templateUrl: './create-employer.component.html',
  styleUrls: ['./create-employer.component.css']
})
export class CreateEmployerComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subscription[] = [];

  employerFirstName: string;
  employerLastName: string;
  employerDateOfBirth: string;
  employerCompany: string;
  employerPosition: string;
  employerStreet: string;
  employerZipCode: string;
  employerCity: string;
  employerCountry: string;
  email: string;
  telephone: string;
  employerForm: EmployerForm;
  loading = false;


  constructor(
    private commonService: CommonService,
    private employerService: EmployerService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.forEach((u) => {
        u.unsubscribe();
      });
    }
  }

  submit(): void {
    this.employerForm = {
      employerFirstName: this.employerFirstName,
      employerLastName: this.employerLastName,
      employerDateOfBirth: this.employerDateOfBirth,
      employerCompany: this.employerCompany,
      employerPosition: this.employerPosition,
      employerTelephone: this.telephone,
      employerEmail: this.email,
      employerStreet: this.employerStreet,
      employerZipCode: this.employerZipCode,
      employerCity: this.employerCity,
      employerCountry: this.employerCountry
    };
    this.loading = true;
    this.unsubscribe$.push(this.employerService.createEmployer(this.employerForm).subscribe(result => {
      this.commonService.setCreateEmployerSubject(true);
      this.location.back();
    }));
  }

}
