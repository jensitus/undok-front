import {Component, OnInit} from '@angular/core';
import {User} from '../auth/model/user';
import {UserService} from '../auth/services/user.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';

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
    private router: Router
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    if (this.currentUser != null) {
      console.log(this.currentUser);
      this.userService.checkAuthToken(this.currentUser.auth_token).subscribe(data => {
        console.log('current User Token valid zum Donner:');
        console.log(data);
      }, error => {
        console.log('error zum donner');
        console.log(error);
        this.router.navigate(['/login']);
      });
    }
    // this.loadAllUsers();
  }

  loadAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }

}
