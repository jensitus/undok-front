import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatComponent } from './stat.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ChartsRoutingModule} from '../../../layout/charts/charts-routing.module';

@NgModule({
    imports: [CommonModule, FontAwesomeModule, ChartsRoutingModule],
    declarations: [StatComponent],
    exports: [StatComponent]
})
export class StatModule {}
