import { Component, signal, inject, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { saveAs } from 'file-saver';
import { CsvService } from '../service/csv.service';
import { AlertService } from '../../admin-template/layout/components/alert/services/alert.service';
import { AlertComponent } from '../../admin-template/layout/components/alert/alert.component';

@Component({
  selector: 'app-back-up',
  standalone: true,
  imports: [
    AlertComponent
  ],
  templateUrl: './back-up.component.html',
  styleUrls: ['./back-up.component.css']
})
export class BackUpComponent {
  // Inject services
  private readonly csvService = inject(CsvService);
  private readonly alertService = inject(AlertService);

  // Signal for CSV list
  csvList = signal<string[]>([]);

  // Computed signals for divided lists
  clientsList = computed(() =>
    this.csvList().filter(csv => csv.includes('clients'))
  );

  counselingsList = computed(() =>
    this.csvList().filter(csv => !csv.includes('clients'))
  );

  constructor() {
    // Load CSV list on initialization
    this.loadCsvList();
  }

  private loadCsvList(): void {
    this.csvService.getCsvList()
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (result) => {
            this.csvList.set(result);
          },
          error: (error) => {
            this.alertService.error(error.error?.text || 'Failed to load CSV list');
          }
        });
  }

  getCsvAsBackup(filename: string): void {
    this.csvService.getBackUpCsv(filename)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (blob) => {
            saveAs(blob, filename);
          },
          error: (error) => {
            this.alertService.error(error.error?.text || 'Failed to download backup');
          }
        });
  }
}
