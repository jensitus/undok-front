import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../../../auth/services/user.service';
import {AlertService} from '../../../components/alert/services/alert.service';
import {AuthenticationService} from '../../../../../auth/services/authentication.service';
import {first} from 'rxjs/operators';
import {User} from '../../../../../auth/model/user';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  loading = false;
  submitted = false;
  error: string;
  username: string;
  password: string;
  email: string;
  passwordConfirmation: string;
  admin = false;
  user: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    console.log(this.admin);
  }

  onSubmit() {
    this.submitted = true;
    console.log('onSubmit');
    this.user = {
      username: this.username,
      email: this.email,
      password: this.password,
      passwordConfirmation: this.passwordConfirmation,
      admin: this.admin
    };
    this.loading = true;
    console.log('this.user', this.user);
    this.authService.register(this.user).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.alertService.success('Registration successful', true);
        this.loading = false;
        // this.router.navigate(['/login']);
        // }, error => {
        //   this.error = error;
        //   console.log('registerComponent', this.error);
        //   this.alertService.error('registerComponent');
        //   this.loading = false;
      });
  }

}
