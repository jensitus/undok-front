import {Component, Input, Output, EventEmitter, OnInit, inject} from '@angular/core';
import {NgbCalendar, NgbDateStruct, NgbInputDatepicker, NgbTimepicker, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faCalendar} from '@fortawesome/free-solid-svg-icons';

export interface DateRange {
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  fromTime?: NgbTimeStruct;
  toTime?: NgbTimeStruct;
}

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    FormsModule,
    NgbTimepicker,
    NgbInputDatepicker,
    NgIf,
    FaIconComponent
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent implements OnInit {

  get isDateTimeMode(): boolean {
    return this.mode === 'datetime';
  }
  @Input() mode: 'date' | 'datetime' = 'date';
  @Input() initialFromDate?: NgbDateStruct;
  @Input() initialToDate?: NgbDateStruct;
  @Input() initialFromTime?: NgbTimeStruct;
  @Input() initialToTime?: NgbTimeStruct;

  @Output() dateRangeChange = new EventEmitter<DateRange>();

  fromDate: NgbDateStruct | null = null;
  toDate: NgbDateStruct | null = null;
  fromTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  toTime: NgbTimeStruct = { hour: 23, minute: 59, second: 59 };
  today = inject(NgbCalendar).getToday();

  protected readonly faCalendar = faCalendar;

  ngOnInit() {
    if (this.initialFromDate) { this.fromDate = this.initialFromDate; }
    if (this.initialToDate) { this.toDate = this.initialToDate; }
    if (this.initialFromTime) { this.fromTime = this.initialFromTime; }
    if (this.initialToTime) { this.toTime = this.initialToTime; }
    this.onDateChange();
  }

  onDateChange() {
    if (this.fromDate && this.toDate) {
      const range: DateRange = {
        fromDate: this.fromDate,
        toDate: this.toDate
      };

      if (this.mode === 'datetime') {
        range.fromTime = this.fromTime;
        range.toTime = this.toTime;
      }
      this.dateRangeChange.emit(range);
    }
  }
}
