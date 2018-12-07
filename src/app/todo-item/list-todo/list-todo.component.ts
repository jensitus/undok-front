import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from '../../auth/services/alert.service';
import {TodoService} from '../services/todo.service';
import {CommonService} from '../../common/common.service';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.css']
})
export class ListTodoComponent implements OnInit {

  todos: any;
  error: any;
  reload = false;

  constructor(
    private router: Router,
    private todoService: TodoService,
    private alertService: AlertService,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.getTodos();
    this.commonService.todoSubject.subscribe(res => {
      this.reload = res;
      if (this.reload) {
        console.log('THE NEW DONNER OR HIMMEL TODO');
        console.log(this.reload);
        this.getTodos();
      }
    });
  }

  private getTodos() {
    this.todoService.getTodos().subscribe(
      (data) => {
        this.todos = data;
      },
      (error) => {
        this.error = error;
        if (this.error === 'Missing token') {
          this.alertService.error('you need to login', true);
          this.router.navigate(['/login']);
        } else {
          this.alertService.error(error);
        }
      }
    );
  }

}
