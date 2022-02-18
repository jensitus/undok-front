import { Component, OnInit } from '@angular/core';
import {SidebarService} from '../../admin-template/shared/services/sidebar.service';

@Component({
  selector: 'app-show-employers',
  templateUrl: './show-employers.component.html',
  styleUrls: ['./show-employers.component.css']
})
export class ShowEmployersComponent implements OnInit {

  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.sidebarService.setCreateEmployerButtonSubject(true);
  }

}
