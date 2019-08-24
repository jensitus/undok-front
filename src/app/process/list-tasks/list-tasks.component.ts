import {Component, OnInit} from '@angular/core';
import {User} from '../../auth/model/user';
import {TaskService} from '../../common/services/task.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.css']
})
export class ListTasksComponent implements OnInit {

  currentUser: User;
  taskList: any;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.taskService.getTaskList(this.currentUser.id.toString()).subscribe(data => {
      this.taskList = data;
      // console.log(this.taskList);
      if (this.taskList.length === 0) {
        this.taskList = null;
      }
    });
  }

  passTheTask(t) {
    this.router.navigate(['tasks/', t.formKey, t.id]);
  }
}
