import {Component, inject, OnInit} from '@angular/core';
import {TaskService} from '../../../service/task.service';
import {RouterLink} from '@angular/router';
import {StatusUtility} from '../../../../common/helper/status-utility';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {

  taskService = inject(TaskService);

  ngOnInit() {
    // Load tasks - signals will update automatically
    this.taskService.getAllTasks().subscribe();
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe();
  }

  getStatusBadgeClass(status: string | undefined): string {
    return StatusUtility.getStatusBadgeClass(status);
  }

}
