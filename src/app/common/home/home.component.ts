import {Component, OnInit} from '@angular/core';
import {User} from '../../auth/model/user';
import {UserService} from '../../auth/services/user.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {CommonService} from '../services/common.service';
import {routerTransition} from '../../router.animations';

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
    this.sliders.push(
      {
        imagePath: 'assets/images/slider1.jpg'
      },
      {
        imagePath: 'assets/images/slider2.jpg'
      },
      {
        imagePath: 'assets/images/slider3.jpg'
      }
    );
    this.processImagePath = 'assets/images/todo.png';
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser != null) {
      this.commonService.checkAuthToken();
      this.router.navigate(['/dashboard']);
    }
  }

  loadAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }

}
