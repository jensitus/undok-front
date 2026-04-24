import { Component } from '@angular/core';
import {faTachometerAlt} from '@fortawesome/free-solid-svg-icons';
import {AlertComponent} from '../../admin-template/layout/components/alert/alert.component';
import {ShowEmployersListComponent} from '../show-employers-list/show-employers-list.component';
import {PageHeaderComponent} from '../../admin-template/shared/page-header/page-header.component';

@Component({
  selector: 'app-show-employers',
  standalone: true,
  templateUrl: './show-employers.component.html',
  imports: [
    AlertComponent,
    ShowEmployersListComponent,
    PageHeaderComponent
  ],
  styleUrls: ['./show-employers.component.css']
})
export class ShowEmployersComponent {
  readonly faTachometerAlt = faTachometerAlt;
}
