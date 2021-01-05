import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ComplexTodoComponent} from '../../../../../process/complex-todo/complex-todo.component';
import {SimpleTodoComponent} from '../../../../../process/simple-todo/simple-todo.component';
import {AddItemDueDateComponent} from '../../../../../todo-item/add-item-due-date/add-item-due-date.component';
import {DescriptionComponent} from '../../../../../todo-item/description/add/description.component';
import {EditDescriptionComponent} from '../../../../../todo-item/description/edit/edit-description.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CompleteTaskComponent} from '../../../../../process/complete-task/complete-task.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    ComplexTodoComponent,
    SimpleTodoComponent,
    AddItemDueDateComponent,
    DescriptionComponent,
    EditDescriptionComponent,
    CompleteTaskComponent
  ],
  exports: [
    CompleteTaskComponent,
    SimpleTodoComponent,
    ComplexTodoComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        FontAwesomeModule
    ]
})
export class TaskModule { }
