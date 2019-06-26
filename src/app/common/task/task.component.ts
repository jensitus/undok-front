import { Component, OnInit } from '@angular/core';
import {TaskService} from '../task.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  task_id: string;
  task: any;

  constructor(
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.task_id = params['taskId'];
      console.log('task_id', this.task_id);
    });
    this.taskService.getTask(this.task_id).subscribe(data => {
      this.task = data;
      console.log('task', this.task);
    });

  }

}
