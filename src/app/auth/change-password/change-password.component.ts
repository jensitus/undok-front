import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user.service';
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

  loading = false;
  submitted = false;
  username: string;
  user_id: number;
  data: any;
  changePwDto: ChangePwDto;
  himmel: any;
  oldPassword: string;
  newPassword: string;
  passwordConfirmation;
  private subscription$: Subscription[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
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
  }

  ngOnDestroy(): void {
      this.subscription$.forEach((s) => {
        s.unsubscribe();
      });
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (!this.oldPassword || !this.newPassword || !this.passwordConfirmation) {
      this.alertService.error('please fill out every field correctly');
      return;
    }
    this.changePwDto = {
      userId: this.user_id,
      password: this.newPassword,
      passwordConfirmation: this.passwordConfirmation,
      oldPassword: this.oldPassword
    };
    this.subscription$.push(this.userService.changePassword(this.changePwDto).subscribe(data => {
      this.himmel = data;
      this.alertService.success(this.himmel.text);
      // this.router.navigate([]);
      this.loading = false;
    }));
  }

}
