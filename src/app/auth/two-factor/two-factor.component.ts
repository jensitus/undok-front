import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SecondFactorForm} from '../model/second-factor-form';
import {User} from '../model/user';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
    this.subscription$.push(this.userService.sendSecondFactorToken(this.secondFactorForm).subscribe((result) => {
      console.log('result', result);
      this.secondFactorUser = result.userDto;
      localStorage.clear();
      localStorage.setItem('currentUser', JSON.stringify(this.secondFactorUser));
      this.router.navigate(['/']);
    }));
  }

}
