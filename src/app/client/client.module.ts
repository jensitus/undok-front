import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {CreateClientComponent} from './create-client/create-client.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ShowClientsComponent} from './show-clients/show-clients.component';
import {ShowSingleClientComponent} from './show-single-client/show-single-client.component';
import {CreateCounselingComponent} from './create-counseling/create-counseling.component';
import {ShowCounselingsComponent} from './show-counselings/show-counselings.component';
import {ShowCounselingsPerClientComponent} from './show-counselings-per-client/show-counselings-per-client.component';
import {EditClientComponent} from './edit-client/edit-client.component';
import {ClientFormComponent} from './client-form/client-form.component';
import {CreateEmpoyerComponent} from './create-empoyer/create-empoyer.component';
import {ShowEmployersListComponent} from './show-employers-list/show-employers-list.component';
import {ShowClientEmployersComponent} from './show-client-employers/show-client-employers.component';
import {NgbdSortableHeader} from './table/sortable.directive';

const appRoutes: Routes = [
  {path: 'create', component: CreateClientComponent},
  {path: 'client-list', component: ShowClientsComponent},
  {path: 'counselings', component: ShowCounselingsComponent},
  {path: ':id', component: ShowSingleClientComponent},

];

@NgModule({
  declarations: [
    CreateClientComponent,
    ShowClientsComponent,
    ShowSingleClientComponent,
    CreateCounselingComponent,
    ShowCounselingsComponent,
    ShowCounselingsPerClientComponent,
    EditClientComponent,
    ClientFormComponent,
    CreateEmpoyerComponent,
    ShowEmployersListComponent,
    ShowClientEmployersComponent,
    NgbdSortableHeader
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    FormsModule,
    NgbModule,
    FontAwesomeModule
  ],
  providers: [DecimalPipe]
})
export class ClientModule { }
