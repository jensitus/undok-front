import {Component, OnInit} from '@angular/core';
import {TaskService} from '../task.service';
import {ActivatedRoute} from '@angular/router';
import {CommonService} from '../common.service';
import {TodoService} from '../../todo-item/services/todo.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  task_id: string;
  task: any;
  entityId: string;
  executionId: string;
  todo_id: string;
  todo: any;

  constructor(
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private todoService: TodoService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.task_id = params['taskId'];
    });
    this.taskService.getTask(this.task_id).toPromise().then(data => {
      this.task = data;
    }).then(response => {
      this.getTheTodoForThisTask(this.task.executionId);
    });
  }

  private getTheTodoForThisTask(executionId) {
    this.taskService.getVariable(executionId, 'entityId').toPromise().then(data => {
      this.todo_id = data.toString();
      console.log('todo_id', this.todo_id);
      this.todoService.getTodo(this.todo_id).subscribe(todo => {
        this.todo = todo;
        console.log('this.todo', this.todo);
      });
    });
  }

}
