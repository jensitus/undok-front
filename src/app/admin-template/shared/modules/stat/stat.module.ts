import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatComponent } from './stat.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [CommonModule, FontAwesomeModule],
    declarations: [StatComponent],
    exports: [StatComponent]
})
export class StatModule {}
