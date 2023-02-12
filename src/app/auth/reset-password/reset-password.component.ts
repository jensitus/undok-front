import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {first} from 'rxjs/operators';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: UntypedFormGroup;
  token: string;
  email: string;
  loading = false;
  submitted = false;
  expired = false;
  message: string;
  data: any;
  error: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.token = params['token'];
    });
    this.email = this.activatedRoute.snapshot.queryParamMap.get('email');

    this.userService.checkTokenExpired(this.token, this.email).pipe(first()).subscribe((data) => {
        this.data = data;
        if (this.data.message) {
          this.alertService.error(this.data.message, true);
          this.router.navigate(['/login']);
        }
        if (this.data.status) {
          if (this.data.status === 204) {
            this.alertService.error('session expired', true);
            this.router.navigate(['/forgot']);
          } else if (this.data.status === 200) {
            console.log('SAY SUCCESS!');
          }
        }
      },
      (error) => {
        this.error = error;
        this.alertService.error(error, true);
      }
    );

    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      email: [this.email, Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.resetPassword(this.resetForm.value, this.token, this.email).pipe(first()).subscribe(
      data => {
        this.data = data;
        if (this.data.message) {
        }
        this.alertService.success('data', true);
        this.router.navigate(['/login']);
      }, error => {
        console.log('error: ' + error.toString());
        this.alertService.error(error);
      }
    );
  }

  get f() {
    return this.resetForm.controls;
  }

}
