import { Component, input, inject, signal, effect } from '@angular/core';
import { Employer } from '../model/employer';
import { EmployerService } from '../service/employer.service';
import { CommonService } from '../../common/services/common.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-employer',
  standalone: true,
  templateUrl: './edit-employer.component.html',
  imports: [FormsModule],
  styleUrls: ['./edit-employer.component.css']
})
export class EditEmployerComponent {
  // Services injected using inject()
  private readonly employerService = inject(EmployerService);
  private readonly commonService = inject(CommonService);

  // Signal-based input
  readonly initialEmployer = input.required<Employer>({ alias: 'employer' });

  // Component state as signals
  readonly employer = signal<Employer | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    // Sync employer signal with input changes
    effect(() => {
      const initial = this.initialEmployer();
      if (initial) {
        // Create a deep copy to avoid mutating the input
        this.employer.set(JSON.parse(JSON.stringify(initial)));
      }
    });
  }

  updateEmployer(): void {
    const employerData = this.employer();

    if (!employerData) {
      this.error.set('No employer data available');
      return;
    }

    if (this.loading()) {
      return; // Prevent double submission
    }

    this.loading.set(true);
    this.error.set(null);

    this.employerService.updateEmployer(employerData.id, employerData).subscribe({
      next: (result) => {
        this.commonService.setCreateEmployer(true);
        setTimeout(() => {
          this.commonService.setCreateEmployer(false);
        }, 100);
        this.loading.set(false);
      },
      error: (err) => {
        const errorMessage = err?.error?.message || 'Failed to update employer';
        this.error.set(errorMessage);
        this.loading.set(false);
        console.error('Error updating employer:', err);
      }
    });
  }
}
