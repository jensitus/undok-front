import { Component, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  // Inject service
  private readonly alertService = inject(AlertService);

  // Signals for state
  message = signal<any>(null);
  messagetype = signal<string>('');

  private dismissTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Set up alert message subscription
    this.alertService
        .getMessage()
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (message) => {
            this.message.set(message);
            this.messagetype.set(message?.type || '');

            // Auto-dismiss success messages after 5 seconds
            if (this.dismissTimeout) {
              clearTimeout(this.dismissTimeout);
            }
            if (message?.type === 'success') {
              this.dismissTimeout = setTimeout(() => {
                this.message.set(null);
                this.messagetype.set('');
              }, 5000);
            }
          },
          error: (error) => {
            console.error('error Alert', error);
          }
        });
  }
}
