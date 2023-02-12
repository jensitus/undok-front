import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  error: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', Validators.required]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log('onSubmit');
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.registerForm.value).pipe(first()).subscribe(data => {
      console.log(data);
      this.alertService.success('Registration successful', true);
      this.loading = false;
      this.router.navigate(['/login']);
    }, error => {
      this.alertService.error(error.error.text, true);
    });
  }

}
