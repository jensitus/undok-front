import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'undok';
  collapedSideBar: boolean;
  receiveCollapsed($event) {
    this.collapedSideBar = $event;
  }
}
