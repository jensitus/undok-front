import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './admin-template/layout/components/header/header.component';
import {SidebarComponent} from './admin-template/layout/components/sidebar/sidebar.component';
import {filter, Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'undok';
  private router = inject(Router);
  collapedSideBar: boolean;
  showSidebar = true;
  private routerSubscription: Subscription;
  private noSidebarRoutes = ['/login', '/register', '/second-factor', '/verify-email'];
  receiveCollapsed($event) {
    this.collapedSideBar = $event;
  }
  ngOnInit(): void {
    this.routerSubscription = this.router.events
                                  .pipe(filter(event => event instanceof NavigationEnd))
                                  .subscribe((event: NavigationEnd) => {
                                    // Check if current route should hide sidebar
                                    this.showSidebar = !this.noSidebarRoutes.some(route =>
                                      event.urlAfterRedirects.startsWith(route));
                                  });
  }
}
