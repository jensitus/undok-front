import { Component, OnInit } from '@angular/core';
import {SidebarService} from '../../admin-template/shared/services/sidebar.service';
import {AlertComponent} from '../../admin-template/layout/components/alert/alert.component';
import {ShowEmployersListComponent} from '../show-employers-list/show-employers-list.component';

@Component({
  selector: 'app-show-employers',
  standalone: true,
  templateUrl: './show-employers.component.html',
  imports: [
    AlertComponent,
    ShowEmployersListComponent
  ],
  styleUrls: ['./show-employers.component.css']
})
export class ShowEmployersComponent implements OnInit {

  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
  }

}
