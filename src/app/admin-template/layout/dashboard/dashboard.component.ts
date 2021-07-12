import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import {User} from '../../../auth/model/user';
import {Router} from '@angular/router';
import {CommonService} from '../../../common/services/common.service';
import {RoleName} from '../../../auth/model/role-name.enum';
import {ClientService} from '../../../client/service/client.service';
import {faCampground, faCoffee, faComments, faPowerOff, faTachometerAlt, faUsers, faTasks, faShoppingCart, faComment, faSurprise} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {

    public alerts: Array<any> = [];
    currentUser: User;
    admin = false;
    counselingCount: number;
    clientCount: number;
    faComments = faComments;
    faTasks = faTasks;
    faShoppingCard = faShoppingCart;
    faSurprise = faSurprise;
    faUser = faUsers;


    constructor(
      private router: Router,
      private commonService: CommonService,
      private clientService: ClientService

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
    }

    ngOnInit() {
      this.getCurrentUser();
      if (this.currentUser === null) {
        this.router.navigate(['/home']);
      } else {
        this.commonService.checkAuthToken();
      }
      this.getNumberOfCounselings();
      this.getNumberOfClients();
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

  private getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  getNumberOfCounselings() {
      this.clientService.numberOfCounselings().subscribe(res => {
        this.counselingCount = res;
    });
  }

  getNumberOfClients() {
      this.clientService.numberOfClients().subscribe(clientCount => {
        this.clientCount = clientCount;
      });
  }

}
