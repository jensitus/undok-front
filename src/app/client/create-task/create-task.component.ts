import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TaskService} from '../service/task.service';
import {Task} from '../model/task';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit {

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  // Input signal for client/case ID
  caseId = input<string>();

  // Signals for component state
  submitting = signal<boolean>(false);
  submitError = signal<string | null>(null);

  // Output event when task is created
  taskCreated = output<Task>();

  // Reactive form
  taskForm: FormGroup;

  constructor() {
    this.taskForm = this.fb.group({
      caseId: [''],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['Open'],
      dueDate: ['']
    });
  }

  ngOnInit(): void {
    // Pre-populate caseId if provided
    console.log('case ID: ', this.caseId());
    if (this.caseId()) {
      this.taskForm.patchValue({caseId: this.caseId()});
      // Optionally disable the field if it should not be editable
      this.taskForm.get('caseId')?.disable();
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    const taskData = this.taskForm.getRawValue();

    this.taskService.createTask(taskData).subscribe({
      next: (createdTask) => {
        this.submitting.set(false);
        this.taskCreated.emit(createdTask);
        this.taskForm.reset({ status: 'Open' });
      },
      error: (error) => {
        this.submitting.set(false);
        this.submitError.set('Failed to create task. Please try again.');
        console.error('Error creating task:', error);
      }
    });
  }

  onCancel(): void {
    this.taskForm.reset({status: 'Open'});
    this.submitError.set(null);
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
      return `${fieldName} must be a valid number`;
    }

    return '';
  }

}
