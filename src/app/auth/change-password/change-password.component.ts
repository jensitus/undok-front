import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {User} from '../model/user';
import {ChangePwDto} from '../model/change-pw-dto';
import {Location} from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePWForm: FormGroup;
  loading = false;
  submitted = false;
  username: string;
  user_id: number;
  data: any;
  changePwDto: ChangePwDto;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.username = params['username'];
    });
    this.userService.getByUsername(this.username).subscribe(data => {
      this.data = data;
      this.user_id = this.data.id;
    });
    this.changePWForm = this.formBuilder.group({
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required],
      old_password: ['', Validators.required]
    });
  }

  get f() {
    return this.changePWForm.controls;
  }

  onSubmit() {
    this.changePwDto = {
      userId: this.user_id,
      newPassword: this.changePWForm.value.new_password,
      confirmPassword: this.changePWForm.value.confirm_password,
      oldPassword: this.changePWForm.value.old_password
    };
    console.log(this.changePwDto);
    this.userService.changePassword(this.changePwDto).subscribe(data => {
      console.log(data); //
      this.router.navigate([]);
    });
  }

}
