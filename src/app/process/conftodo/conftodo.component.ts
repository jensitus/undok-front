import {Component, Input, OnInit} from '@angular/core';
import {TaskService} from '../../common/services/task.service';
import {ActivatedRoute} from '@angular/router';
import {TodoService} from '../../todo-item/services/todo.service';
import {AlertService} from '../../common/alert/services/alert.service';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../../auth/services/user.service';

@Component({
  selector: 'app-conftodo',
  templateUrl: './conftodo.component.html',
  styleUrls: ['./conftodo.component.css']
})
export class ConftodoComponent implements OnInit {

  @Input() taskId: string;
  simple: boolean;
  task: any;

  constructor(
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private todoService: TodoService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.taskService.getTask(this.taskId).toPromise().then(data => {
      this.task = data;
      console.log('this.task', this.task);
    });
  }

}
