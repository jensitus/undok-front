import {Component, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../../router.animations';
import {User} from '../../../auth/model/user';
import {Router, RouterLink} from '@angular/router';
import {CommonService} from '../../../common/services/common.service';
import {ClientService} from '../../../client/service/client.service';
import {faComments, faShoppingCart, faSurprise, faTachometerAlt, faTasks, faUsers} from '@fortawesome/free-solid-svg-icons';
import {EmployerService} from '../../../client/service/employer.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AlertService} from '../components/alert/services/alert.service';
import {NgbCarousel, NgbCarouselConfig, NgbSlide} from '@ng-bootstrap/ng-bootstrap';
import {TimelineComponent} from './components';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {TaskListComponent} from '../../../client/components/tasks/task-list/task-list.component';
import {StatComponent} from '../../shared/modules/stat/stat.component';
import {AlertComponent} from '../components/alert/alert.component';

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
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private commonService: CommonService,
    private clientService: ClientService,
    private employerService: EmployerService,
    private alertService: AlertService,
    config: NgbCarouselConfig
  ) {
    this.alerts.push(
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
    );
    config.interval = 20000;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = false;
  }

  public alerts: Array<any> = [];
  currentUser: User;
  admin = false;
  counselingCount: number;
  clientCount: number;
  employerCount: number;
  faComments = faComments;
  faTasks = faTasks;
  faShoppingCard = faShoppingCart;
  faSurprise = faSurprise;
  faUser = faUsers;
  private unsubscribe$ = new Subject();
  showNavigationArrows = false;
  showNavigationIndicators = false;
  images = [
    {title: 'Schneeberg', short: 'schneeberg', src: 'assets/images/schneeberg.jpg', alt: 'Im Vordergrung Wien, im Hintergrung der Schneeberg'},
    {title: 'Møn - Dänemark', short: 'Møn', src: 'assets/images/sonnenblumenfeld.jpg', alt: 'Sonnenblumenfeld in Dänemark'},
    {title: 'Sonnenaufgang an der Elbe', short: 'Sunrise', src: 'assets/images/klangschale-Elbe.jpeg', alt: 'Sonnenaufgang an der Elbe bei Neu Darchau'},
    {title: 'Semmering Gegend', short: 'Semmering', src: 'assets/images/dsc-schneeberg-background.jpeg', alt: 'Schneebergblick in der Semmering Gegend'},
  ];

  protected readonly faTachometerAlt = faTachometerAlt;

  ngOnInit() {
    this.getCurrentUser();
    if (this.currentUser === null) {
      this.router.navigate(['/home']);
    } else {
      this.commonService.checkAuthToken();
    }
    this.getNumberOfCounselings();
    this.getNumberOfClients();
    this.getNumberOfEmployers();
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this.unsubscribe$.next();
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  private getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  getNumberOfCounselings() {
    this.clientService.numberOfCounselings().subscribe({
      next: value => {
        this.counselingCount = value;
      },
      error: err => {
        this.alertService.error(err.error.text);
      }
    });
  }

  getNumberOfClients() {
    this.clientService.numberOfClients().subscribe({
        next: clientCount => {
          this.clientCount = clientCount;
          console.log('clientCount', this.clientCount);
        }
      }
    );
  }

  getNumberOfEmployers() {
    this.employerService.getNumberOfEmployers().pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: employerCount => {
          this.employerCount = employerCount;
        }
      }
    );
  }
}
