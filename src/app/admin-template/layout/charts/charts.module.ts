import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule as Ng2Charts } from 'ng2-charts';

import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts.component';
import { PageHeaderModule } from '../../shared';
import { DoughnutComponent } from './doughnut/doughnut.component';

@NgModule({
    imports: [CommonModule, Ng2Charts, ChartsRoutingModule, PageHeaderModule],
    exports: [
        DoughnutComponent
    ],
    declarations: [ChartsComponent, DoughnutComponent]
})
export class ChartsModule {}
