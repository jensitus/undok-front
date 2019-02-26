import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {User} from '../auth/model/user';
import {UserService} from '../auth/services/user.service';
import {CommonService} from '../common/common.service';
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
      console.log('demo_subject_nav_bar_comp: ');
      console.log(res);
      this.reload = res;
    });
    if (this.reload === true) {
      console.log('RELOAD');
      console.log(this.reload);
    }

    this.links = [
      {
        label: 'Login'
      },
      {
        label: 'register'
      }
    ];

    this.items = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [{
          label: 'New',
          icon: 'pi pi-fw pi-plus',
          items: [
            {label: 'Project'},
            {label: 'Other'},
          ]
        },
          {label: 'Open'},
          {separator: true},
          {label: 'Quit'}
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {label: 'Delete', icon: 'pi pi-fw pi-trash'},
          {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
        ]
      },
      {
        label: 'Help',
        icon: 'pi pi-fw pi-question',
        items: [
          {
            label: 'Contents'
          },
          {
            label: 'Search',
            icon: 'pi pi-fw pi-search',
            items: [
              {
                label: 'Text',
                items: [
                  {
                    label: 'Workspace'
                  }
                ]
              },
              {
                label: 'File'
              }
            ]}
        ]
      },
      {
        label: 'Actions',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
              {label: 'Save', icon: 'pi pi-fw pi-save'},
              {label: 'Update', icon: 'pi pi-fw pi-save'},
            ]
          },
          {
            label: 'Other',
            icon: 'pi pi-fw pi-tags',
            items: [
              {label: 'Delete', icon: 'pi pi-fw pi-minus'}
            ]
          }
        ]
      },
      {separator: true},
      {
        label: 'Quit', icon: 'pi pi-fw pi-times'
      }
    ];

  }

  getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

}
