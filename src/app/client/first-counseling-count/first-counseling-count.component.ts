import {Component, inject} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ClientService} from '../service/client.service';
import {DateTimeService} from '../service/date-time.service';
import {Time} from '../model/time';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {DatePickerComponent} from '../../common/date-picker/date-picker.component';
import {ReportService} from '../service/report.service';

export interface LanguageResult {
  language: string;
  count: number;
}

export interface NationalityCount {
  nationality: string;
  count: number;
}

@Component({
  selector: 'app-first-counseling-count',
  standalone: true,
  templateUrl: './first-counseling-count.component.html',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    DatePickerComponent
  ],
  styleUrls: ['./first-counseling-count.component.css']
})
export class FirstCounselingCountComponent {

  taskForm: FormGroup;

  constructor() {
    this.taskForm = this.fb.group({
      dueDate: ['']
    });
  }
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  fromTime: Time = {hour: 0, minute: 0};
  toTime: Time = {hour: 23, minute: 59};

  private fb = inject(FormBuilder);
  private reportService = inject(ReportService);
  private dateTimeService = inject(DateTimeService);

  loading = false;
  error: string | null = null;


  protected readonly faBars = faBars;

  totalNumberOfClientsBoolean: boolean;
  firstCounselingOnly: boolean;
  languagesUsed: boolean;
  nationalityCountBoolean: boolean;

  totalNumberOfClientsError: string | null = null;
  languageError: string | null = null;
  nationalityError: string | null = null;


  languagesUsedResult: LanguageResult[] | null = null;
  totalNumberOfClientsResult: number | null = null;
  firstCounselingOnlyResult: number | null = null;
  nationalitiesResult: NationalityCount[] | null = null;

  fetchCount(): void {
    console.log(this.languagesUsed);
    console.log(this.firstCounselingOnly);
    this.error = null;
    this.firstCounselingOnlyResult = null;
    if (!this.fromDate || !this.toDate) {
      this.error = 'Please select both From and To dates.';
      return;
    }
    try {
      const fromIso = this.dateTimeService.mergeDateAndTime(this.fromDate, this.fromTime);
      const toIso = this.dateTimeService.mergeDateAndTime(this.toDate, this.toTime);
      this.loading = true;
      console.log(fromIso);
      console.log(toIso);

      if (this.totalNumberOfClientsBoolean) {
        this.reportService.countNumberOfCounselingsByDateRange(fromIso, toIso).subscribe({
          next: (count) => {
            this.totalNumberOfClientsResult = count;
            this.loading = false;
          },
          error: (err) => {
            this.totalNumberOfClientsError = err?.error?.message || 'Failed to fetch the count.';
          }
        });
      }

      if (this.firstCounselingOnly) {
        this.reportService.countFirstCounselingInRange(fromIso, toIso).subscribe({
          next: (count) => {
            this.firstCounselingOnlyResult = count;
            this.loading = false;
          },
          error: (err) => {
            this.error = err?.error?.message || 'Failed to fetch the count.';
            this.loading = false;
          }
        });
      }

      if (this.languagesUsed) {
        this.reportService.countLanguagesByDateRange(fromIso, toIso).subscribe({
          next: (result) => {
            this.languagesUsedResult = result;
            this.loading = false;
          },
          error: (err) => {
            this.error = err?.error?.message || 'Failed to fetch languages';
          }
        });
      }

      if (this.nationalityCountBoolean) {
        this.reportService.countNationalitiesByDateRange(fromIso, toIso).subscribe({
          next: (result) => {
            this.nationalitiesResult = result;
            this.loading = false;
          },
          error: (err) => {
            this.nationalityError = err?.error?.message || 'Failed to fetch nationalities';
          }
        });
      }

    } catch (e) {
      this.error = 'Failed to format dates.';
    }
  }

  onDateRangeSelected(event: any) {

    console.log(event.fromDate);
    this.fromDate = event.fromDate;
    console.log(event.toDate);
    this.toDate = event.toDate;

  }

  fetchGenericCount() {
    this.fetchCount();
  }
}
