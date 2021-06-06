import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {ConfirmAccountForm} from '../model/confirm-account-form';
import {AuthenticationService} from '../services/authentication.service';
import {Subscription} from 'rxjs';
import {ResponseMessage} from '../../common/helper/response-message';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css']
})
export class ConfirmAccountComponent implements OnInit, OnDestroy {

  token: string;
  email: string;
  data: any;
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
  username: string;
  confirmAccountDto: ConfirmAccountForm;
  subscriptions: Subscription[] | undefined;
  responseMessage: ResponseMessage;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.token = params['token'];
    });
    this.activatedRoute.params.subscribe(params => {
      this.email = params['email'];
    });
    console.log(this.token, this.email);
    this.userService.confirmAccount(this.token, this.email).subscribe(data => {
      this.data = data;
      if (this.data.text === 'token valid') {
        this.alertService.success('please change your password', true);
      } else {
        this.alertService.error('too late, contact your administrator', true);
        this.router.navigate(['/home']);
      }

      // }, error => {
      //   this.alertService.error(error, true);
    });
  }

  onSubmit() {
    this.confirmAccountDto = {
      username: this.username,
      confirmationToken: this.token,
      email: this.email,
      password: this.password,
      passwordConfirmation: this.passwordConfirmation,
      oldPassword: this.oldPassword
    };
    this.authService.confirmAccountAndSetNewPassword(this.confirmAccountDto).subscribe(result => {
      this.responseMessage = result;
      console.log(result);
      if (this.responseMessage.text === 'User successfully confirmed') {
        this.alertService.error(this.responseMessage.text, true);
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      for (const s of this.subscriptions) {
        s.unsubscribe();
      }
    }
  }

}
