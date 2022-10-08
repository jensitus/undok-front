import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {first} from 'rxjs/operators';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  data: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.forgotForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.forgotPassword(this.forgotForm.value).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.data = data;
        this.alertService.success(this.data.text, true);
        this.router.navigate(['/home']);
      }, error => {
        // console.log(error);
        // this.alertService.error(error);
      }
    );
  }

}
