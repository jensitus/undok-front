import {Component, OnInit} from '@angular/core';
import {User} from '../../auth/model/user';
import {TaskService} from '../../common/services/task.service';
import {Router} from '@angular/router';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.css']
})
export class ListTasksComponent implements OnInit {

  currentUser: User;
  taskList: any;
  reload = false;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getTaskList();
    this.reloadIfNewTask();
  }

  passTheTask(t) {
    this.router.navigate(['tasks/', t.formKey, t.id]);
  }

  getTaskList() {
    this.taskService.getTaskList(this.currentUser.id.toString()).subscribe(data => {
      this.taskList = data;
      // console.log(this.taskList);
      if (this.taskList.length === 0) {
        this.taskList = null;
      }
    });
  }

  reloadIfNewTask() {
    this.commonService.todoSubject.subscribe(res => {
      this.reload = res;
      if (this.reload) {
        this.getTaskList();
      }
    });
  }

}
