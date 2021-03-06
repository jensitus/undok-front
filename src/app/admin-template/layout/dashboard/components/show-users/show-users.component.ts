import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../../../auth/services/user.service';
import {User} from '../../../../../auth/model/user';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
