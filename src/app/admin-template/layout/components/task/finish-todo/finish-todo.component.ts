import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../../auth/model/user';
import {Item} from '../../../../../todo-item/model/item';
import {TaskService} from '../../../../../common/services/task.service';
import {TodoService} from '../../../../../todo-item/services/todo.service';

@Component({
  selector: 'app-finish-todo',
  templateUrl: './finish-todo.component.html',
  styleUrls: ['./finish-todo.component.css']
})
export class FinishTodoComponent implements OnInit {

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

  constructor(
    private taskService: TaskService,
    private todoService: TodoService
  ) { }

  ngOnInit() {
    this.taskService.getTask(this.taskId).toPromise().then(data => {
      this.task = data;
      this.executionId = this.task.executionId;
      this.getTheTodoForThis(this.task.executionId);
    });
  }

  private getTheTodoForThis(executionId) {
    this.taskService.getVariable(executionId, 'entityId').toPromise().then(data => {
      this.todo_id = data.toString();
      console.log('todo_id', this.todo_id);
      this.todoService.getTodo(this.todo_id).subscribe(todo => {
        this.todo = todo;
        console.log('task.this.todo', this.todo);
        this.todo_title = this.todo.title;
        this.todo_users = this.todo.users;
        this.items = this.todo.items;
        this.items = this.items.sort();
        this.todo_id = this.todo.id;
      });
    });

  }

}
