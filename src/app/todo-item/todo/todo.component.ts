import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {TodoService} from '../services/todo.service';
import {AlertService} from '../../common/alert/services/alert.service';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  todos: any;
  error: any;
  reload = false;
  loading = false;
  todo: any;
  data: any;

  constructor(
    private router: Router,
    private todoService: TodoService,
    private alertService: AlertService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.commonService.checkAuthToken();
    // this.getTodos();
    // this.getReloadFromCommonService();
    this.getAlertMessage();
  }

  private getTodos() {
    this.todoService.getTodos().subscribe((data) => {
        this.todos = data;
      }, (error) => {
        this.error = error;
        if (this.error === 'Missing token' || 'Signature has expired') {
          this.alertService.error('you need to login', true);
          // this.router.navigate(['/login']);
        } else {
          this.alertService.error(error);
        }
      }
    );
  }

  // updateTodo(todo_id) {
  //   this.loading = true;
  //   this.todo = {
  //     id: todo_id
  //   };
  //   this.todoService.updateTodo(todo_id, this.todo).subscribe(data => {
  //     this.todo = data;
  //     if (this.todo.done === true) {
  //       this.alertService.success('Todo is really done');
  //     } else if (this.todo.done === false) {
  //       this.alertService.success('this todo is not done yet');
  //     }
  //     this.loading = false;
  //     this.getTodos();
  //   }, error => {
  //     console.log('update todo', error);
  //   });
  // }

  // deleteTodo(todo_id) {
  //   this.loading = true;
  //   this.todoService.deleteTodo(todo_id).subscribe(data => {
  //     this.data = data;
  //     console.log('delete todo success', this.data, data);
  //     this.alertService.success(this.data.text, true);
  //     this.getTodos();
  //     this.loading = false;
  //   }, error => {
  //     this.error = error;
  //     // this.alertService.error(error);
  //   });
  //
  // }

  private getReloadFromCommonService() {
    this.commonService.todoSubject.subscribe(res => {
      this.reload = res;
      if (this.reload) {
        this.getTodos();
      }
    });
  }

  private getAlertMessage() {
    this.alertService.success('your Todo List', true);
  }

}
