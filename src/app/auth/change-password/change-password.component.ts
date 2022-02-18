import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {User} from '../model/user';
import {ChangePwDto} from '../model/change-pw-dto';
import {Location} from '@angular/common';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  changePWForm: FormGroup;
  loading = false;
  submitted = false;
  username: string;
  user_id: number;
  data: any;
  changePwDto: ChangePwDto;
  himmel: any;
  private subscription$: Subscription[];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private location: Location,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.username = params['username'];
    });
    this.subscription$.push(this.userService.getByUsername(this.username).subscribe(data => {
      this.data = data;
      this.user_id = this.data.id;
    }));
    this.changePWForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', Validators.required],
      old_password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  get f() {
    return this.changePWForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.changePWForm.invalid) {
      return;
    }
    this.loading = true;
    this.changePwDto = {
      userId: this.user_id,
      password: this.changePWForm.value.password,
      passwordConfirmation: this.changePWForm.value.passwordConfirmation,
      oldPassword: this.changePWForm.value.old_password
    };
    console.log(this.changePwDto);
    this.subscription$.push(this.userService.changePassword(this.changePwDto).subscribe(data => {
      this.himmel = data;
      this.alertService.success(this.himmel.text);
      // this.router.navigate([]);
      this.loading = false;
    }));
  }

}
