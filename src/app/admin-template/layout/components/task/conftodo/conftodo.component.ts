import {Component, Input, OnInit} from '@angular/core';
import {TaskService} from '../../../../../common/services/task.service';
import {ActivatedRoute} from '@angular/router';
import {TodoService} from '../../../../../todo-item/services/todo.service';
import {AlertService} from '../../../../../common/alert/services/alert.service';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../../../../../auth/services/user.service';
import {User} from '../../../../../auth/model/user';
import {Item} from '../../../../../todo-item/model/item';
import {TodoTaskService} from '../../../../../process/services/todo-task.service';

@Component({
  selector: 'app-conftodo',
  templateUrl: './conftodo.component.html',
  styleUrls: ['./conftodo.component.css']
})
export class ConftodoComponent implements OnInit {

  @Input() taskId: string;
  simple: boolean;
  task: any;
  todo_id: string;
  todo: any;
  todo_title: string;
  todo_users: User[];
  item: any;
  items: Item[];
  executionId: string;
  todoFinished: boolean;

  constructor(
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private todoService: TodoService,
    private alertService: AlertService,
    private todoTaskService: TodoTaskService,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.taskService.getTask(this.taskId).toPromise().then(data => {
      this.task = data;
      this.executionId = this.task.executionId;
      this.getTheTodoForThis(this.task.executionId);
      this.alertService.success('check if Todo is simple or complex');
    });
  }

  private getTheTodoForThis(executionId) {
    this.taskService.getVariable(executionId, 'entityId').toPromise().then(data => {
      this.todo_id = data.toString();
      this.todoService.getTodo(this.todo_id).subscribe(todo => {
        this.todo = todo;
        this.todo_title = this.todo.title;
        this.todo_users = this.todo.users;
        this.items = this.todo.items;
        this.items = this.items.sort();
        this.todo_id = this.todo.id;
      });
    });

  }

}
