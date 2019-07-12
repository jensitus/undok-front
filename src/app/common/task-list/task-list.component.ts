import { Component, OnInit } from '@angular/core';
import {TaskService} from '../task.service';
import {User} from '../../auth/model/user';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  currentUser: User;
  taskList: any;

  constructor(
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.taskService.getTaskList(this.currentUser.id.toString()).subscribe(data => {
      this.taskList = data;
      console.log('taskList:', this.taskList);
    });
  }

}
