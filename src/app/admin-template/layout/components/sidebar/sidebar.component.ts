import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {User} from '../../../../auth/model/user';
import {
  faBars,
  faCampground,
  faCoffee,
  faEarListen,
  faPowerOff,
  faSave, faSearch,
  faSurprise,
  faTachometerAlt,
  faTasks,
  faUser,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import {SidebarService} from '../../../shared/services/sidebar.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NgClass, NgIf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    NgClass,
    RouterLink,
    FaIconComponent,
    RouterLinkActive,
    NgIf
  ],
  standalone: true
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
  faUsers = faUsers;
  faTasks = faTasks;
  faSurprise = faSurprise;
  faSave = faSave;
  faEarListen = faEarListen;
  private unsubscribe$ = new Subject();
  showClientButtons = false;
  showCreateEmployerButton = false;
  clientId: string;

  @Output() collapsedEvent = new EventEmitter<boolean>();

  constructor(
    /*private translate: TranslateService,*/
    public router: Router,
    private sidebarService: SidebarService
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
    this.getSidebarButtons();
    this.getCreateEmployerButton();
    this.getClientIDForCreatingCounseling();
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

  getClientIDForCreatingCounseling() {
    this.sidebarService.clientIdForCreateCounselingSubject.pipe(takeUntil(this.unsubscribe$)).subscribe(clientId => {
      this.clientId = clientId;
    });
  }

  getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  getSidebarButtons() {
    this.sidebarService.clientButtonSubject.pipe(takeUntil(this.unsubscribe$)).subscribe(showButtons => {
      this.showClientButtons = showButtons;
    });
  }

  getCreateEmployerButton() {
    this.sidebarService.createEmployerButtonSubject.pipe(takeUntil(this.unsubscribe$)).subscribe(createEmployerButton => {
      this.showCreateEmployerButton = createEmployerButton;
    });
  }

  newCounseling() {
    this.sidebarService.setNewCounselingSubject(true);
  }

  newEmployer() {
    this.sidebarService.setNewEmployerSubject(true);
  }

  assignEmployer() {
    this.sidebarService.setAssignEmployerSubject(true);
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
  protected readonly faSearch = faSearch;
}
