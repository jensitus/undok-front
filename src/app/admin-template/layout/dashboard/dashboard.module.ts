import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
    TimelineComponent,
    NotificationComponent,
    ChatComponent
} from './components';
import { StatModule } from '../../shared';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ChartsModule} from '../charts/charts.module';
import {AlertModule} from '../components/alert/alert.module';
import {TaskListComponent} from '../../../client/components/tasks/task-list/task-list.component';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule,
        NgbAlertModule,
        DashboardRoutingModule,
        StatModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        FormsModule,
        ChartsModule,
        AlertModule,
        TaskListComponent
    ],
  declarations: [
    DashboardComponent,
    TimelineComponent,
    NotificationComponent,
    ChatComponent
  ]
})
export class DashboardModule {}
