import {Component, effect, inject, input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faEdit, faPlus, faTasks, faTrash, faGears, faClock} from '@fortawesome/free-solid-svg-icons';
import {TaskService} from '../../../service/task.service';
import {CreateTaskComponent} from '../create-task/create-task.component';
import {Task} from '../../../model/task';
import {AlertService} from '../../../../admin-template/layout/components/alert/services/alert.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {StatusUtility} from '../../../../common/helper/status-utility';
import {faFloppyDisk} from '@fortawesome/free-solid-svg-icons/faFloppyDisk';
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark';

@Component({
  selector: 'app-case-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule, CreateTaskComponent, FormsModule],
  templateUrl: './case-task-list.component.html',
  styleUrl: './case-task-list.component.css'
})
export class CaseTaskListComponent implements OnInit {

  constructor() {
    // Effect to reload tasks when caseId changes
    effect(() => {
      const id = this.caseId();
      if (id) {
        this.loadTasks(id);
      }
    });
  }

  taskService = inject(TaskService);
  alertService = inject(AlertService);
  modalService = inject(NgbModal);

  // Input for the case ID
  caseId = input.required<string>();
  @ViewChild('create_task') createTask: TemplateRef<any> | undefined;
  private closeResult = '';

  // Editing state
  editingStatusTaskId: string | null = null;
  editingStatus = '';
  editingTimeTaskId: string | null = null;
  editingTime = '';

  // Icons
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faTasks = faTasks;

  protected readonly faGears = faGears;

  protected readonly faClock = faClock;

  private static getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit() {
    // Initial load
    this.loadTasks(this.caseId());
  }

  loadTasks(caseId: string | undefined) {
    this.taskService.getTasksByCaseId(caseId).subscribe();
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          // Tasks signal will automatically update
        },
        error: (err) => {
          console.error('Error deleting task:', err);
        }
      });
    }
  }

  getStatusBadgeClass(status: string | undefined): string {
    return StatusUtility.getStatusBadgeClass(status);
  }

  // getStatusBadgeClass(status: string | undefined): string {
  //   switch (status?.toLowerCase()) {
  //     case 'completed':
  //       return 'badge bg-success';
  //     case 'in progress':
  //       return 'badge bg-primary';
  //     case 'cancelled':
  //       return 'badge bg-danger';
  //     default:
  //       return 'badge bg-secondary';
  //   }
  // }

  formatDate(date: Date | string | undefined): string {
    if (!date) { return 'Not set'; }
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  onTaskCreated(task: Task, modal: any): void {
    console.log('Task created:', task);
    modal.close('Task created');
    // Optional: Show success message, refresh list, etc.
    this.alertService.success('Task created successfully');
    // Optional: Refresh task list if you have one
    this.loadTasks(this.caseId()); // Refresh client data if needed
  }

  openCreateTaskModal(content: any): void {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${CaseTaskListComponent.getDismissReason(reason)}`;
    });
  }

  startEditStatus(taskId: string, currentStatus: string | undefined): void {
    this.editingStatusTaskId = taskId;
    this.editingStatus = currentStatus || 'Open';
  }

  endEditStatus() {
    this.editingStatusTaskId = null;
    this.editingStatus = '';
  }

  startEditTime(taskId: string, currentRequiredTime: number | undefined): void {
    this.editingTimeTaskId = taskId;
    // Convert minutes to HH:mm format
    if (currentRequiredTime) {
      const hours = Math.floor(currentRequiredTime / 60);
      const minutes = currentRequiredTime % 60;
      this.editingTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      this.editingTime = '00:00';
    }
  }

  updateTaskRequiredTime(taskId: string): void {
    // Convert HH:mm to minutes
    const [hoursStr, minutesStr] = this.editingTime.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const totalMinutes = hours * 60 + minutes;

    this.taskService.updateTask(taskId, { requiredTime: totalMinutes }).subscribe({
      next: () => {
        this.alertService.success('Required time updated successfully');
        this.editingTimeTaskId = null;
        this.editingTime = '';
      },
      error: (err) => {
        console.error('Error updating required time:', err);
        this.alertService.error('Failed to update required time');
        this.editingTimeTaskId = null;
        this.editingTime = '';
      }
    });
  }

  cancelEditTime(): void {
    this.editingTimeTaskId = null;
    this.editingTime = '';
  }

  formatRequiredTime(requiredTime: number | undefined): string {
    if (!requiredTime) { return '-'; }
    const hours = Math.floor(requiredTime / 60);
    const minutes = requiredTime % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  updateTaskStatus(taskId: string): void {
    this.taskService.updateTask(taskId, { status: this.editingStatus }).subscribe({
      next: () => {
        this.alertService.success('Task status updated successfully');
        this.editingStatusTaskId = null;
        this.editingStatus = '';
      },
      error: (err) => {
        console.error('Error updating task status:', err);
        this.alertService.error('Failed to update task status');
        this.editingStatusTaskId = null;
        this.editingStatus = '';
      }
    });
  }

  protected readonly faFloppyDisk = faFloppyDisk;
  protected readonly faXmark = faXmark;
}
