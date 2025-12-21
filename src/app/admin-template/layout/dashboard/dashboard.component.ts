import { Component, signal, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbCarousel, NgbCarouselConfig, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../../../router.animations';
import { User } from '../../../auth/model/user';
import { CommonService } from '../../../common/services/common.service';
import { ClientService } from '../../../client/service/client.service';
import { EmployerService } from '../../../client/service/employer.service';
import { AlertService } from '../components/alert/services/alert.service';
import { TimelineComponent } from './components';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TaskListComponent } from '../../../client/components/tasks/task-list/task-list.component';
import { StatComponent } from '../../shared/modules/stat/stat.component';
import { AlertComponent } from '../components/alert/alert.component';
import {
  faComments,
  faShoppingCart,
  faSurprise,
  faTachometerAlt,
  faTasks,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

interface Alert {
  id: number;
  type: string;
  message: string;
}

interface CarouselImage {
  title: string;
  short: string;
  src: string;
  alt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    TimelineComponent,
    FaIconComponent,
    TaskListComponent,
    RouterLink,
    StatComponent,
    AlertComponent,
    NgbCarousel,
    NgbSlide
  ],
  animations: [routerTransition()]
})
export class DashboardComponent {
  // Inject services
  private readonly router = inject(Router);
  private readonly commonService = inject(CommonService);
  private readonly clientService = inject(ClientService);
  private readonly employerService = inject(EmployerService);
  private readonly alertService = inject(AlertService);

  // Signals for state
  alerts = signal<Alert[]>([
    {
      id: 1,
      type: 'success',
      message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
    },
    {
      id: 2,
      type: 'warning',
      message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
    }
  ]);

  currentUser = signal<User | null>(null);
  counselingCount = signal<number>(0);
  clientCount = signal<number>(0);
  employerCount = signal<number>(0);

  // Computed signal for admin check
  isAdmin = computed(() => this.currentUser()?.admin ?? false);

  // Font Awesome icons
  readonly faComments = faComments;
  readonly faTasks = faTasks;
  readonly faShoppingCard = faShoppingCart;
  readonly faSurprise = faSurprise;
  readonly faUser = faUsers;
  readonly faTachometerAlt = faTachometerAlt;

  // Carousel configuration
  readonly showNavigationArrows = false;
  readonly showNavigationIndicators = false;

  readonly images: CarouselImage[] = [
    {
      title: 'Schneeberg',
      short: 'schneeberg',
      src: 'assets/images/schneeberg.jpg',
      alt: 'Im Vordergrung Wien, im Hintergrung der Schneeberg'
    },
    {
      title: 'Møn - Dänemark',
      short: 'Møn',
      src: 'assets/images/sonnenblumenfeld.jpg',
      alt: 'Sonnenblumenfeld in Dänemark'
    },
    {
      title: 'Sonnenaufgang an der Elbe',
      short: 'Sunrise',
      src: 'assets/images/klangschale-Elbe.jpeg',
      alt: 'Sonnenaufgang an der Elbe bei Neu Darchau'
    },
    {
      title: 'Semmering Gegend',
      short: 'Semmering',
      src: 'assets/images/dsc-schneeberg-background.jpeg',
      alt: 'Schneebergblick in der Semmering Gegend'
    }
  ];

  constructor(config: NgbCarouselConfig) {
    // Configure carousel
    config.interval = 20000;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = false;

    // Initialize on construction
    this.initializeComponent();
  }

  private initializeComponent(): void {
    this.getCurrentUser();

    const user = this.currentUser();
    if (user === null) {
      this.router.navigate(['/home']);
    } else {
      this.commonService.checkAuthToken();
    }

    this.getNumberOfCounselings();
    this.getNumberOfClients();
    this.getNumberOfEmployers();
  }

  closeAlert(alert: Alert): void {
    this.alerts.update(currentAlerts =>
      currentAlerts.filter(a => a.id !== alert.id)
    );
  }

  private getCurrentUser(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson) as User;
      this.currentUser.set(user);
    }
  }

  private getNumberOfCounselings(): void {
    this.clientService
        .numberOfCounselings()
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (value) => {
            this.counselingCount.set(value);
          },
          error: (err) => {
            this.alertService.error(err.error?.text || 'Failed to load counseling count');
          }
        });
  }

  private getNumberOfClients(): void {
    this.clientService
        .numberOfClients()
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (clientCount) => {
            this.clientCount.set(clientCount);
            console.log('clientCount', clientCount);
          },
          error: (err) => {
            console.error('Failed to load client count:', err);
          }
        });
  }

  private getNumberOfEmployers(): void {
    this.employerService
        .getNumberOfEmployers()
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (employerCount) => {
            this.employerCount.set(employerCount);
          },
          error: (err) => {
            console.error('Failed to load employer count:', err);
          }
        });
  }
}
