import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {AlertService} from '../../common/alert/services/alert.service';
import {User} from '../model/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  currentUser: User;
  user_id: number;
  user: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.getCurrentUser();
    this.activatedRoute.params.subscribe(params => {
      this.user_id = params['id'];
    });
    this.userService.getById(this.user_id).subscribe(data => {
      this.user = data;
      console.log(this.user);
    }, error => {
      this.alertService.error(error);
    });
  }

  private getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

}
