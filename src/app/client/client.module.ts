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
import {CreateEmployerComponent} from './create-empoyer/create-employer.component';
import {ShowEmployersListComponent} from './show-employers-list/show-employers-list.component';
import {ShowClientEmployersComponent} from './show-client-employers/show-client-employers.component';
import {NgbdSortableHeader} from './table/sortable.directive';
import {EditCounselingComponent} from './edit-counseling/edit-counseling.component';
import {AlertModule} from '../admin-template/layout/components/alert/alert.module';
import {CreateCommentComponent} from './create-comment/create-comment.component';
import {ShowEmployersComponent} from './show-employers/show-employers.component';
import {
  CreateClientEmployerJobDescriptionComponent
} from './create-client-employer-job-description/create-client-employer-job-description.component';
import {
  EditClientEmployerJobDescriptionComponent
} from './edit-client-employer-job-description/edit-client-employer-job-description.component';
import {CounselingComponent} from './counseling/counseling.component';
import {NewLinePipe} from './new-line.pipe';
import {ShowSingleEmployerComponent} from './show-single-employer/show-single-employer.component';
import {EditEmployerComponent} from './edit-employer/edit-employer.component';
import {SelectBoxComponent} from './select-box/single/select-box.component';
import {DeleteComponent} from './delete/delete.component';
import {DeleteModalComponent} from './delete/delete-modal/delete-modal.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {MultiSelectBoxComponent} from './select-box/multi/multi-select-box.component';
import {ShowCounselingComponent} from './show-counseling/show-counseling.component';
import {AddCategoryComponent} from './select-box/add-category/add-category.component';
import {BackUpComponent} from './back-up/back-up.component';
import { EditCategoriesComponent } from './edit-categories/edit-categories.component';

const appRoutes: Routes = [
  {path: 'employers', component: ShowEmployersComponent},
  {path: 'csv-download-list', component: BackUpComponent},
  {path: 'edit-categories', component: EditCategoriesComponent},
  {path: 'create', component: CreateClientComponent},
  {path: 'client-list', component: ShowClientsComponent},
  {path: 'counselings', component: ShowCounselingsComponent},
  {path: ':id', component: ShowSingleClientComponent},
  {path: 'create/employer', component: CreateEmployerComponent},
  {path: 'employers/:id', component: ShowSingleEmployerComponent},
  {path: ':id/create-counseling', component: CreateCounselingComponent},
  {path: ':id/edit', component: EditClientComponent},
  {path: ':client_id/counselings/:counseling_id', component: ShowCounselingComponent}
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
    CreateEmployerComponent,
    ShowEmployersListComponent,
    ShowClientEmployersComponent,
    NgbdSortableHeader,
    EditCounselingComponent,
    CreateCommentComponent,
    ShowEmployersComponent,
    CreateClientEmployerJobDescriptionComponent,
    EditClientEmployerJobDescriptionComponent,
    CounselingComponent,
    NewLinePipe,
    ShowSingleEmployerComponent,
    EditEmployerComponent,
    SelectBoxComponent,
    DeleteComponent,
    DeleteModalComponent,
    MultiSelectBoxComponent,
    ShowCounselingComponent,
    AddCategoryComponent,
    BackUpComponent,
    EditCategoriesComponent
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    RouterModule.forChild(appRoutes),
    FormsModule,
    NgbModule,
    FontAwesomeModule,
    AlertModule
  ],
  exports: [
  ],
  providers: [DecimalPipe]
})
export class ClientModule {
}
