import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SecondFactorForm} from '../model/second-factor-form';
import {User} from '../model/user';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {AlertComponent} from '../../admin-template/layout/components/alert/alert.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  templateUrl: './two-factor.component.html',
  imports: [
    AlertComponent,
    FormsModule
  ],
  styleUrls: ['./two-factor.component.css']
})
export class TwoFactorComponent implements OnInit, OnDestroy {

  twoFactorToken: string;
  secondFactorForm: SecondFactorForm;
  currentUser: User;
  subscription$: Subscription[] = [];
  secondFactorUser: User;

  constructor(
    private userService: UserService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.alertService.success('we\'ve sent you a little token for signing in', true);
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

  submit() {
    this.secondFactorForm = {
      userId: this.currentUser.id,
      token: this.twoFactorToken
    };
    console.log(this.secondFactorForm);
    this.subscription$.push(this.userService.sendSecondFactorToken(this.secondFactorForm).subscribe((result) => {
      this.secondFactorUser = result.userDto;
      console.log('secondFactorUser: ', this.secondFactorUser);
      localStorage.clear();
      localStorage.setItem('currentUser', JSON.stringify(this.secondFactorUser));

      this.router.navigate(['home']);
    }));
  }

}
