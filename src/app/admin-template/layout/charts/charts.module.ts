import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts.component';
import { PageHeaderModule } from '../../shared';
import { DoughnutComponent } from './doughnut/doughnut.component';

@NgModule({
  imports: [CommonModule, ChartsRoutingModule, PageHeaderModule, ChartsComponent, DoughnutComponent],
    exports: [
        DoughnutComponent
    ],
    declarations: []
})
export class ChartsModule {}
