import { Component, inject, signal, computed, effect } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateTimeService } from '../service/date-time.service';
import { Time } from '../model/time';
import { FormsModule } from '@angular/forms';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { DatePickerComponent } from '../../common/date-picker/date-picker.component';
import { ReportService } from '../service/report.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface LanguageResult {
  language: string;
  count: number;
}

export interface NationalityCount {
  nationality: string;
  count: number;
}

export interface GenderCount {
  gender: string;
  count: number;
}

export interface SectorCount {
  sector: string;
  count: number;
}

export interface ActivityCount {
  activity: string;
  count: number;
}

interface ReportState {
  totalNumberOfClients: { data: number | null; error: string | null };
  firstCounselingOnly: { data: number | null; error: string | null };
  languages: { data: LanguageResult[] | null; error: string | null };
  nationalities: { data: NationalityCount[] | null; error: string | null };
  genders: { data: GenderCount[] | null; error: string | null };
  sectors: { data: SectorCount[] | null; error: string | null };
  activities: { data: ActivityCount[] | null; error: string | null };
}

@Component({
  selector: 'app-report',
  standalone: true,
  templateUrl: './report.component.html',
  imports: [FormsModule, DatePickerComponent],
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  // Services injected using inject()
  private readonly reportService = inject(ReportService);
  private readonly dateTimeService = inject(DateTimeService);

  // Signal-based state
  readonly fromDate = signal<NgbDateStruct | undefined>(undefined);
  readonly toDate = signal<NgbDateStruct | undefined>(undefined);
  readonly fromTime = signal<Time>({ hour: 0, minute: 0 });
  readonly toTime = signal<Time>({ hour: 23, minute: 59 });

  readonly loading = signal(false);
  readonly generalError = signal<string | null>(null);

  // Checkbox states as signals
  readonly totalNumberOfClientsEnabled = signal(false);
  readonly firstCounselingOnlyEnabled = signal(false);
  readonly languagesUsedEnabled = signal(false);
  readonly nationalityCountEnabled = signal(false);
  readonly genderEnabled = signal(false);
  readonly sectorEnabled = signal(false);
  readonly activityEnabled = signal(false);

  // Report results as signal
  readonly reportState = signal<ReportState>({
    totalNumberOfClients: { data: null, error: null },
    firstCounselingOnly: { data: null, error: null },
    languages: { data: null, error: null },
    nationalities: { data: null, error: null },
    genders: { data: null, error: null },
    sectors: { data: null, error: null },
    activities: { data: null, error: null }
  });

  // Computed signals for easy access
  readonly totalNumberOfClientsResult = computed(() =>
    this.reportState().totalNumberOfClients.data
  );
  readonly totalNumberOfClientsError = computed(() =>
    this.reportState().totalNumberOfClients.error
  );

  readonly firstCounselingOnlyResult = computed(() =>
    this.reportState().firstCounselingOnly.data
  );
  readonly firstCounselingOnlyError = computed(() =>
    this.reportState().firstCounselingOnly.error
  );

  readonly languagesUsedResult = computed(() =>
    this.reportState().languages.data
  );
  readonly languageError = computed(() =>
    this.reportState().languages.error
  );

  readonly nationalitiesResult = computed(() =>
    this.reportState().nationalities.data
  );
  readonly nationalityError = computed(() =>
    this.reportState().nationalities.error
  );

  readonly gendersResult = computed(() =>
    this.reportState().genders.data
  );
  readonly genderError = computed(() =>
    this.reportState().genders.error
  );

  readonly sectorResult = computed(() =>
    this.reportState().sectors.data
  );
  readonly sectorError = computed(() =>
    this.reportState().sectors.error
  );

  readonly activityResult = computed(() =>
    this.reportState().activities.data
  );
  readonly activityError = computed(() =>
    this.reportState().activities.error
  );

  // Computed signal to check if dates are valid
  readonly datesValid = computed(() => {
    return this.fromDate() !== undefined && this.toDate() !== undefined;
  });

  // Computed signal for any enabled report
  readonly anyReportEnabled = computed(() => {
    return this.totalNumberOfClientsEnabled() ||
      this.firstCounselingOnlyEnabled() ||
      this.languagesUsedEnabled() ||
      this.nationalityCountEnabled() ||
      this.genderEnabled() ||
      this.sectorEnabled() ||
      this.activityEnabled();
  });

  readonly faBars = faBars;

  fetchCount(): void {
    this.generalError.set(null);

    if (!this.datesValid()) {
      this.generalError.set('Please select both From and To dates.');
      return;
    }

    try {
      const fromDate = this.fromDate();
      const toDate = this.toDate();

      if (!fromDate || !toDate) {
        this.generalError.set('Please select both From and To dates.');
        return;
      }

      const fromIso = this.dateTimeService.mergeDateAndTime(
        fromDate,
        this.fromTime()
      );
      const toIso = this.dateTimeService.mergeDateAndTime(
        toDate,
        this.toTime()
      );

      this.loading.set(true);

      // Create an object to hold all observables
      const requests: { [key: string]: any } = {};

      if (this.totalNumberOfClientsEnabled()) {
        requests['totalNumberOfClients'] = this.reportService
                                               .countNumberOfCounselingsByDateRange(fromIso, toIso)
                                               .pipe(
                                                 map(data => ({ data, error: null })),
                                                 catchError(err => of({
                                                   data: null,
                                                   error: err?.error?.message || 'Failed to fetch the count.'
                                                 }))
                                               );
      }

      if (this.firstCounselingOnlyEnabled()) {
        requests['firstCounselingOnly'] = this.reportService
                                              .countFirstCounselingInRange(fromIso, toIso)
                                              .pipe(
                                                map(data => ({ data, error: null })),
                                                catchError(err => of({
                                                  data: null,
                                                  error: err?.error?.message || 'Failed to fetch the count.'
                                                }))
                                              );
      }

      if (this.languagesUsedEnabled()) {
        requests['languages'] = this.reportService
                                    .countLanguagesByDateRange(fromIso, toIso)
                                    .pipe(
                                      map(data => ({ data, error: null })),
                                      catchError(err => of({
                                        data: null,
                                        error: err?.error?.message || 'Failed to fetch languages'
                                      }))
                                    );
      }

      if (this.nationalityCountEnabled()) {
        requests['nationalities'] = this.reportService
                                        .countNationalitiesByDateRange(fromIso, toIso)
                                        .pipe(
                                          map(data => ({ data, error: null })),
                                          catchError(err => of({
                                            data: null,
                                            error: err?.error?.message || 'Failed to fetch nationalities'
                                          }))
                                        );
      }

      if (this.genderEnabled()) {
        requests['genders'] = this.reportService
                                  .countGender(fromIso, toIso)
                                  .pipe(
                                    map(data => ({ data, error: null })),
                                    catchError(err => of({
                                      data: null,
                                      error: err?.error?.message || 'Failed to fetch gender'
                                    }))
                                  );
      }

      if (this.sectorEnabled()) {
        requests['sectors'] = this.reportService
                                  .countSector(fromIso, toIso)
                                  .pipe(
                                    map(data => ({ data, error: null })),
                                    catchError(err => of({
                                      data: null,
                                      error: err?.error?.message || 'Failed to fetch sector'
                                    }))
                                  );
      }

      if (this.activityEnabled()) {
        requests['activities'] = this.reportService
                                     .countActivity(fromIso, toIso)
                                     .pipe(
                                       map(data => ({ data, error: null })),
                                       catchError(err => of({
                                         data: null,
                                         error: err?.error?.message || 'Failed to fetch activity'
                                       }))
                                     );
      }

      // Execute all requests in parallel using forkJoin
      if (Object.keys(requests).length > 0) {
        forkJoin(requests).subscribe({
          next: (results) => {
            this.reportState.update(state => ({
              ...state,
              ...results
            }));
            this.loading.set(false);
          },
          error: () => {
            this.generalError.set('An unexpected error occurred.');
            this.loading.set(false);
          }
        });
      } else {
        this.loading.set(false);
      }

    } catch (e) {
      this.generalError.set('Failed to format dates.');
      this.loading.set(false);
    }
  }

  onDateRangeSelected(event: { fromDate: NgbDateStruct; toDate: NgbDateStruct }): void {
    this.fromDate.set(event.fromDate);
    this.toDate.set(event.toDate);
  }

  fetchGenericCount(): void {
    this.fetchCount();
  }
}
