import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts.component';
import { PageHeaderModule } from '../../shared';
import { DoughnutComponent } from './doughnut/doughnut.component';
import {NgChartsModule} from 'ng2-charts';

@NgModule({
  imports: [CommonModule, ChartsRoutingModule, PageHeaderModule, NgChartsModule],
    exports: [
        DoughnutComponent
    ],
    declarations: [ChartsComponent, DoughnutComponent]
})
export class ChartsModule {}
