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
  private noSidebarRoutes = ['/login', '/register', '/second-factor', '/verify-email', '/forgot', '/auth/reset_password/:token/edit'];
  receiveCollapsed($event) {
    this.collapedSideBar = $event;
  }
  ngOnInit(): void {
    this.routerSubscription = this.router.events
                                  .pipe(filter(event => event instanceof NavigationEnd))
                                  .subscribe((event: NavigationEnd) => {
                                    // Check if current route should hide sidebar
                                    this.showSidebar = !this.noSidebarRoutes.some(route => {
                                      // Handle parameterized routes like /auth/reset_password/:token/edit
                                      if (route.includes(':')) {
                                        const pattern = route.replace(/:[^\/]+/g, '[^/]+');
                                        const regex = new RegExp(`^${pattern}$`);
                                        return regex.test(event.urlAfterRedirects);
                                      }
                                      return event.urlAfterRedirects.startsWith(route);
                                    });
                                  });
  }
}
