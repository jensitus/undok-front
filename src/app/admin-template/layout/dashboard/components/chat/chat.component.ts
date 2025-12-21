import { Component, OnInit } from '@angular/core';
import {NgbDropdown, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [
    NgbDropdown,
    NgbDropdownToggle
  ],
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}
