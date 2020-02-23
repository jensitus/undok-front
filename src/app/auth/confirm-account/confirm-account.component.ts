import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css']
})
export class ConfirmAccountComponent implements OnInit {

  token: string;
  email: string;
  data: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.token = params['token'];
    });
    this.email = this.activatedRoute.snapshot.queryParamMap.get('email');
    this.userService.confirmAccount(this.token, this.email).subscribe(data => {
      this.data = data;
      this.alertService.success(this.data.text, true);
    // }, error => {
    //   this.alertService.error(error, true);
    });
  }

}
