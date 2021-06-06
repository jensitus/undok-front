import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../../../../auth/model/user';
import {faCoffee, faUser, faBars, faPowerOff, faTachometerAlt, faCampground} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isActive: boolean;
  collapsed: boolean;
  showMenu: string;
  pushRightClass: string;
  currentUser: User;
//  admin = false;
  faCoffee = faCoffee;
  faUser = faUser;
  faBars = faBars;
  faPowerOff = faPowerOff;
  faTachometerAlt = faTachometerAlt;
  faCampground = faCampground;

  @Output() collapsedEvent = new EventEmitter<boolean>();

  constructor(
    /*private translate: TranslateService,*/
    public router: Router
  ) {
    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit() {
    this.isActive = false;
    this.collapsed = false;
    this.showMenu = '';
    this.pushRightClass = 'push-right';
    this.getCurrentUser();
    // this.checkAdmin();
  }


  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedEvent.emit(this.collapsed);
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
  }

  // changeLang(language: string) {
  //     this.translate.use(language);
  // }

  onLoggedout() {
    localStorage.removeItem('isLoggedin');
  }

  getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  // checkAdmin() {
  //   console.log('this.currentUser.roles', this.currentUser.roles);
  //   for (const r of this.currentUser.roles) {
  //     if (r.name === 'ROLE_ADMIN') {
  //       console.log('ADMIN');
  //       this.admin = true;
  //     }
  //   }
  // }
}
