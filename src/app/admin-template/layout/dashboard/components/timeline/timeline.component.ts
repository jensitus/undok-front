import { Component, input, signal, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientService } from '../../../../../client/service/client.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  // Inject services
  private readonly clientService = inject(ClientService);

  // Input as signal
  userId = input<string>('', { alias: 'user_id' });

  // Signal for timeline items
  items = signal<any[]>([]);

  constructor() {
    // Load timeline items on initialization
    this.loadTimelineItems();

    // Optional: Reload timeline when userId changes
    effect(() => {
      const id = this.userId();
      if (id) {
        console.log('User ID changed:', id);
        // Could reload timeline based on user_id if needed
      }
    });
  }

  private loadTimelineItems(): void {
    this.clientService.getItemForTimeline()
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (result) => {
            this.items.set(result);
          },
          error: (error) => {
            console.error('Error loading timeline items:', error);
            this.items.set([]);
          }
        });
  }
}
