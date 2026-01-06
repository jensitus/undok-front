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

  constructor() {
    // Set up alert message subscription
    this.alertService
        .getMessage()
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (message) => {
            this.message.set(message);
            this.messagetype.set(message?.type || '');
          },
          error: (error) => {
            console.error('error Alert', error);
          }
        });
  }
}
