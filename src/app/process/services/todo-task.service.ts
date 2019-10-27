import {Injectable} from '@angular/core';
import {TaskService} from '../../common/services/task.service';
import {TodoService} from '../../todo-item/services/todo.service';
import {User} from '../../auth/model/user';
import {Item} from '../../todo-item/model/item';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class TodoTaskService {

  todo_id: string;
  todo: any;
  todo_title: string;
  todo_users: User[];
  item: any;
  items: Item[];

  constructor(
    private taskService: TaskService,
    private todoService: TodoService,
    private alertService: AlertService
  ) {
  }

  public getTheTodoForThisTask(executionId) {

  }
}
