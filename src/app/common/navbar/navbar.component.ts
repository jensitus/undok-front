import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {User} from '../../auth/model/user';
import {UserService} from '../../auth/services/user.service';
import {CommonService} from '../services/common.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUser: User;
  @Input() titlePrefix: string;

  constructor() {
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

}
