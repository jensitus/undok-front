import {Component, OnInit} from '@angular/core';
import {User} from '../../auth/model/user';
import {UserService} from '../../auth/services/user.service';
import {Router} from '@angular/router';
import {CommonService} from '../services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentUser: User;
  users: User[] = [];
  public sliders: Array<any> = [];
  processImagePath: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser != null) {
      this.commonService.checkAuthToken();
      this.router.navigate(['/dashboard']);
    }
  }

}
