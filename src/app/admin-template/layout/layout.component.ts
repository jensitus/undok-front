import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {RouterOutlet} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  imports: [
    HeaderComponent,
    SidebarComponent,
    RouterOutlet,
    NgClass
  ],
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    collapedSideBar: boolean;

    constructor() {}

    ngOnInit() {}

    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }
}
