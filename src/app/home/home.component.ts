import {Component, OnInit} from '@angular/core';
import {User} from '../auth/model/user';
import {UserService} from '../auth/services/user.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {CommonService} from '../common/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentUser: User;
  users: User[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private commonService: CommonService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
      this.commonService.checkAuthToken();
  }

  loadAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }

}
