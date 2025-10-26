import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TaskService} from '../../../service/task.service';
import {Task} from '../../../model/task';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CommonModule} from '@angular/common';
import { faEdit, faSave, faTimes, faTrash, faTachometerAlt, faTasks } from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertService} from '../../../../admin-template/layout/components/alert/services/alert.service';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-show-single-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterLink],
  templateUrl: './show-single-task.component.html',
  styleUrl: './show-single-task.component.css'
})
export class ShowSingleTaskComponent implements OnInit {

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private alertService = inject(AlertService);

  // Input for task ID or full task object
  taskId = input<string>();
  task = input<Task>();

  // Outputs
  taskUpdated = output<Task>();
  taskDeleted = output<number>();
  cancelled = output<void>();

  // Icons
  faEdit = faEdit;
  faSave = faSave;
  faTimes = faTimes;
  faTrash = faTrash;
  faTachometerAlt = faTachometerAlt;
  faTasks = faTasks;

  // Signals for component state
  currentTask = signal<Task | null>(null);
  isEditMode = signal<boolean>(false);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  error = signal<string | null>(null);

  // Reactive form
  taskForm: FormGroup;
  private routeParams = toSignal(this.activatedRoute.params);

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['Open'],
      dueDate: [''],
      requiredTime: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const params = this.routeParams();
    const client_id = params?.['client_id'];
    const taskId = params?.['task_id'];
    if (taskId) {
      this.loadTask(String(taskId));
    }
  }

  loadTask(taskId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.currentTask.set(task);
        this.populateForm();
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load task');
        this.loading.set(false);
        this.alertService.error('Failed to load task');
        console.error('Error loading task:', err);
      }
    });
  }

  populateForm(): void {
    const task = this.currentTask();
    if (!task) { return; }

    this.taskForm.patchValue({
      title: task.title,
      description: task.description || '',
      status: task.status || 'Open',
      dueDate: task.dueDate ? this.formatDateForInput(task.dueDate) : '',
      requiredTime: task.requiredTime || 0
    });
  }

  formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  toggleEditMode(): void {
    this.isEditMode.update(mode => !mode);
    if (!this.isEditMode()) {
      // Reset form when cancelling edit
      this.populateForm();
      this.error.set(null);
    }
  }

  onSave(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const task = this.currentTask();
    if (!task) { return; }

    this.saving.set(true);
    this.error.set(null);

    const updatedData = {
      ...task,
      ...this.taskForm.value
    };

    this.taskService.updateTask(task.id, updatedData).subscribe({
      next: (updatedTask) => {
        this.currentTask.set(updatedTask);
        this.saving.set(false);
        this.isEditMode.set(false);
        this.alertService.success('Task updated successfully');
      },
      error: (err) => {
        this.error.set('Failed to update task');
        this.saving.set(false);
        this.alertService.error('Failed to update task');
        console.error('Error updating task:', err);
      }
    });
  }

  onDelete(): void {
    const task = this.currentTask();
    if (!task) { return; }

    if (!confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.loading.set(false);
        this.alertService.success('Task deleted successfully');
      },
      error: (err) => {
        this.error.set('Failed to delete task');
        this.loading.set(false);
        this.alertService.error('Failed to delete task');
        console.error('Error deleting task:', err);
      }
    });
  }

  navigateBack(): void {
    const task = this.currentTask();
    if (task?.caseId) {
      // Navigate to the case/client - adjust this route as needed
      this.router.navigate(['/clients', task.caseId]);
    } else {
      // Fallback navigation
      this.router.navigate(['/dashboard']);
    }
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.taskForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `${fieldName} must be at least ${minLength} characters`;
    }
    if (field?.hasError('min')) {
      return `${fieldName} must be a positive number`;
    }

    return '';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) { return 'Not set'; }
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'badge bg-success mb-2';
      case 'in progress':
        return 'badge bg-primary mb-2';
      case 'cancelled':
        return 'badge bg-danger mb-2';
      default:
        return 'badge bg-secondary mb-2';
    }
  }

}
