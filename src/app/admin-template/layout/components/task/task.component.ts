import {Component, OnInit} from '@angular/core';
import {TaskService} from '../../../../common/services/task.service';
import {ActivatedRoute} from '@angular/router';
import {TodoService} from '../../../../todo-item/services/todo.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Item} from '../../../../todo-item/model/item';
import {User} from '../../../../auth/model/user';
import {Description} from '../../../../todo-item/model/description';
import {AlertService} from '../alert/services/alert.service';
import {UserService} from '../../../../auth/services/user.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  formKey: string;
  taskId: string;

  constructor(
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.formKey = params['formKey'];
      this.taskId = params['taskId'];
    });
  }



}
