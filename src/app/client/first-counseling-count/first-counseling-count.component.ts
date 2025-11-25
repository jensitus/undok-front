import {Component, inject} from '@angular/core';
import {NgbDateStruct, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {ClientService} from '../service/client.service';
import {DateTimeService} from '../service/date-time.service';
import {Time} from '../model/time';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {JsonPipe, NgIf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {DatePickerComponent} from '../../common/date-picker/date-picker.component';

export interface LanguageResult {
  language: string;
  count: number;
}

@Component({
  selector: 'app-first-counseling-count',
  standalone: true,
  templateUrl: './first-counseling-count.component.html',
  imports: [
    FormsModule,
    NgbInputDatepicker,
    NgIf,
    FaIconComponent,
    ReactiveFormsModule,
    DatePickerComponent,
    JsonPipe
  ],
  styleUrls: ['./first-counseling-count.component.css']
})
export class FirstCounselingCountComponent {

  taskForm: FormGroup;

  constructor(private clientService: ClientService, public dateTimeService: DateTimeService) {
    this.taskForm = this.fb.group({
      dueDate: ['']
    });
  }
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  fromTime: Time = {hour: 0, minute: 0};
  toTime: Time = {hour: 23, minute: 59};

  private fb = inject(FormBuilder);

  loading = false;
  error: string | null = null;
  result: number | null = null;

  protected readonly faBars = faBars;
  dateObject: NgbDateStruct;
  firstCounselingOnly: boolean;
  languagesUsed: boolean;
  languagesUsedResult: LanguageResult[];
  languageError: string | null = null;

  fetchCount(): void {
    console.log(this.languagesUsed);
    console.log(this.firstCounselingOnly);
    this.error = null;
    this.result = null;
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

      if (this.firstCounselingOnly) {
        this.clientService.countFirstCounselingInRange(fromIso, toIso).subscribe({
          next: (count) => {
            this.result = count;
            this.loading = false;
          },
          error: (err) => {
            this.error = err?.error?.message || 'Failed to fetch the count.';
            this.loading = false;
          }
        });
      }

      if (this.languagesUsed) {
        this.clientService.countLanguagesByDateRange(fromIso, toIso).subscribe({
          next: (result) => {
            this.languagesUsedResult = result;
            this.loading = false;
          },
          error: (err) => {
            this.error = err?.error?.message || 'Failed to fetch languages';
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
