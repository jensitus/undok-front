import {Component, OnInit} from '@angular/core';
import {TaskService} from '../task.service';
import {User} from '../../auth/model/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  currentUser: User;
  taskList: any;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.taskService.getTaskList(this.currentUser.id.toString()).subscribe(data => {
      this.taskList = data;
      console.log('taskList:', this.taskList);
    });
  }

  passTheTask(t) {
    this.router.navigate(['tasks/ut-todo/', t.id]);
  }

}
