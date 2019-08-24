import {Component, OnInit} from '@angular/core';
import {TaskService} from '../../common/services/task.service';
import {User} from '../../auth/model/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
