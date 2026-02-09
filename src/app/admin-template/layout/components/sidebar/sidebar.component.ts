import {Component, inject, output, signal} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {User} from '../../../../auth/model/user';
import {
  faBars,
  faBriefcaseMedical,
  faCampground,
  faCoffee,
  faEarListen,
  faPowerOff,
  faSave,
  faSearch,
  faSurprise,
  faTachometerAlt,
  faTasks,
  faUser,
  faUsers, faAngleDoubleDown, faAngleDoubleLeft, faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import {SidebarService} from '../../../shared/services/sidebar.service';
import {NgClass} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    NgClass,
    RouterLink,
    FaIconComponent,
    RouterLinkActive,
  ],
  standalone: true
})
export class SidebarComponent {
  // Inject services
  private readonly router = inject(Router);
  private readonly sidebarService = inject(SidebarService);

  // Signals for state
  isActive = signal<boolean>(false);
  collapsed = signal<boolean>(false);
  showMenu = signal<string>('');
  currentUser = signal<User | null>(this.getCurrentUser());

  // Access signals directly from the service
  showClientButtons = this.sidebarService.clientButtons;
  showCreateEmployerButton = this.sidebarService.createEmployerButton;
  clientId = this.sidebarService.clientIdForCreateCounseling;

  // Output event
  collapsedEvent = output<boolean>();

  // Constants
  private readonly pushRightClass = 'push-right';

  // Font Awesome icons
  protected readonly faCoffee = faCoffee;
  protected readonly faUser = faUser;
  protected readonly faBars = faBars;
  protected readonly faPowerOff = faPowerOff;
  protected readonly faTachometerAlt = faTachometerAlt;
  protected readonly faCampground = faCampground;
  protected readonly faUsers = faUsers;
  protected readonly faTasks = faTasks;
  protected readonly faSurprise = faSurprise;
  protected readonly faSave = faSave;
  protected readonly faEarListen = faEarListen;
  protected readonly faSearch = faSearch;
  protected readonly faBriefcaseMedical = faBriefcaseMedical;
  protected readonly faAngleDoubleDown = faAngleDoubleDown;
  protected readonly faAngleDoubleLeft = faAngleDoubleLeft;
  protected readonly faAngleDoubleRight = faAngleDoubleRight;

  constructor() {
    // Set up router event subscription for mobile sidebar handling
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        if (window.innerWidth <= 992 && this.isToggled()) {
          this.toggleSidebar();
        }
      });
  }

  // eventCalled(): void {
  //   this.isActive.update(value => !value);
  // }
  //
  // addExpandClass(element: string): void {
  //   if (element === this.showMenu()) {
  //     this.showMenu.set('0');
  //   } else {
  //     this.showMenu.set(element);
  //   }
  // }

  toggleCollapsed(): void {
    this.collapsed.update(value => !value);
    this.collapsedEvent.emit(this.collapsed());
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar(): void {
    const dom: HTMLElement = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr(): void {
    const dom: HTMLElement = document.querySelector('body');
    dom.classList.toggle('rtl');
  }

  // onLoggedout(): void {
  //   localStorage.removeItem('isLoggedin');
  // }

  private getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  // newCounseling(): void {
  //   this.sidebarService.setNewCounselingSubject(true);
  // }

  // newEmployer(): void {
  //   this.sidebarService.setNewEmployerSubject(true);
  // }

  assignEmployer(): void {
    this.sidebarService.setAssignEmployer(true);
  }
}
