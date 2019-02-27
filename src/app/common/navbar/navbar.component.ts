import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {User} from '../../auth/model/user';
import {UserService} from '../../auth/services/user.service';
import {CommonService} from '../common.service';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUser: User;
  reload = false;
  navbarOpen = false;
  items: MenuItem[];
  links: MenuItem[];

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    this.getCurrentUser();
    this.commonService.demoSubject.subscribe(res => {
      // this.reload = res;
    });
    if (this.reload === true) {
      console.log('RELOAD');
      console.log(this.reload);
    }
  }

  getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

}
