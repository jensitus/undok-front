import {Component, OnDestroy, OnInit} from '@angular/core';
import {faTachometerAlt, faUsers} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent implements OnInit, OnDestroy {

  protected readonly faUsers = faUsers;
  protected readonly faTachometerAlt = faTachometerAlt;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
