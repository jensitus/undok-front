import {Component, effect, inject, input, signal, TemplateRef, viewChild} from '@angular/core';
import {SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faEdit, faPlus, faTasks, faGears, faClock, faXmark, faFloppyDisk} from '@fortawesome/free-solid-svg-icons';
import {TaskService} from '../../../service/task.service';
import {CreateTaskComponent} from '../create-task/create-task.component';
import {Task} from '../../../model/task';
import {AlertService} from '../../../../admin-template/layout/components/alert/services/alert.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {StatusUtility} from '../../../../common/helper/status-utility';

@Component({
  selector: 'app-case-task-list',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, CreateTaskComponent, FormsModule, SlicePipe],
  templateUrl: './case-task-list.component.html',
  styleUrl: './case-task-list.component.css'
})
export class CaseTaskListComponent {

  protected readonly taskService = inject(TaskService);
  private readonly alertService = inject(AlertService);
  private readonly modalService = inject(NgbModal);

  readonly caseId = input.required<string>();
  readonly createTask = viewChild<TemplateRef<any>>('create_task');

  // Editing state as signals
  readonly editingStatusTaskId = signal<string | null>(null);
  readonly editingStatus = signal('');
  readonly editingTimeTaskId = signal<string | null>(null);
  readonly editingHours = signal(0);
  readonly editingMinutes = signal(0);

  // Icons
  protected readonly faEdit = faEdit;
  protected readonly faPlus = faPlus;
  protected readonly faTasks = faTasks;
  protected readonly faGears = faGears;
  protected readonly faClock = faClock;
  protected readonly faFloppyDisk = faFloppyDisk;
  protected readonly faXmark = faXmark;

  constructor() {
    effect(() => {
      const id = this.caseId();
      if (id) {
        this.loadTasks(id);
      }
    });
  }

  loadTasks(caseId: string): void {
    this.taskService.getTasksByCaseId(caseId).subscribe();
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        error: (err) => console.error('Error deleting task:', err)
      });
    }
  }

  getStatusBadgeClass(status: string | undefined): string {
    return StatusUtility.getStatusBadgeClass(status);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) { return 'Not set'; }
    return new Date(date).toLocaleDateString();
  }

  formatRequiredTime(requiredTime: number | undefined): string {
    if (!requiredTime) { return '-'; }
    const hours = Math.floor(requiredTime / 60);
    const minutes = requiredTime % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  onTaskCreated(task: Task, modal: any): void {
    modal.close('Task created');
    this.alertService.success('Task created successfully');
    this.loadTasks(this.caseId());
  }

  openCreateTaskModal(): void {
    this.modalService.open(this.createTask(), { size: 'lg' });
  }

  startEditStatus(taskId: string, currentStatus: string | undefined): void {
    this.editingStatusTaskId.set(taskId);
    this.editingStatus.set(currentStatus || 'Open');
  }

  endEditStatus(): void {
    this.editingStatusTaskId.set(null);
    this.editingStatus.set('');
  }

  startEditTime(taskId: string, currentRequiredTime: number | undefined): void {
    this.editingTimeTaskId.set(taskId);
    this.editingHours.set(currentRequiredTime ? Math.floor(currentRequiredTime / 60) : 0);
    this.editingMinutes.set(currentRequiredTime ? currentRequiredTime % 60 : 0);
  }

  cancelEditTime(): void {
    this.editingTimeTaskId.set(null);
    this.editingHours.set(0);
    this.editingMinutes.set(0);
  }

  updateTaskStatus(taskId: string): void {
    this.taskService.updateTask(taskId, { status: this.editingStatus() }).subscribe({
      next: () => {
        this.alertService.success('Task status updated successfully');
        this.editingStatusTaskId.set(null);
        this.editingStatus.set('');
      },
      error: (err) => {
        console.error('Error updating task status:', err);
        this.alertService.error('Failed to update task status');
        this.editingStatusTaskId.set(null);
        this.editingStatus.set('');
      }
    });
  }

  updateTaskRequiredTime(taskId: string): void {
    const totalMinutes = this.editingHours() * 60 + this.editingMinutes();

    this.taskService.updateTask(taskId, { requiredTime: totalMinutes }).subscribe({
      next: () => {
        this.alertService.success('Required time updated successfully');
        this.editingTimeTaskId.set(null);
        this.editingHours.set(0);
        this.editingMinutes.set(0);
      },
      error: (err) => {
        console.error('Error updating required time:', err);
        this.alertService.error('Failed to update required time');
        this.editingTimeTaskId.set(null);
        this.editingHours.set(0);
        this.editingMinutes.set(0);
      }
    });
  }
}
