import {Component, Input, OnInit} from '@angular/core';
import {TaskService} from '../../common/services/task.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-complete-task',
  templateUrl: './complete-task.component.html',
  styleUrls: ['./complete-task.component.css']
})
export class CompleteTaskComponent implements OnInit {

  @Input() task_id: string;
  @Input() execution_id: string;
  @Input() type: string;
  data: any;
  itemsOpen: any;

  constructor(
    private taskService: TaskService,
    private alertService: AlertService,
    private router: Router
  ) {
  }

  ngOnInit() {
    console.log('complete-task-this.task', this.task_id);
    console.log('the fucking task', this.execution_id);
  }

  submit() {
    if (this.type === 'todo') {
      this.taskService.checkOpenItems(this.task_id).subscribe(data => {
        this.itemsOpen = data;
        if (this.itemsOpen === true) {
          console.log('no open items', this.itemsOpen);
          this.alertService.error('there are still things to do', true);
        } else {
          console.log('this.itemsOpen', this.itemsOpen);
          this.taskService.completeTask(this.task_id).subscribe(resdata => {
            console.log('resdata', resdata);
            this.router.navigate(['tasks/list']);
          });
        }
      });
    }
  }

}
