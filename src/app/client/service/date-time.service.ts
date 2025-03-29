import {Injectable} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Time} from '../model/time';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  dateObject: NgbDateStruct;
  localTimeMinute: string;
  localTimeHour: string;

  constructor() { }

  mergeDateAndTime(dateObject: NgbDateStruct, time: Time): string {
    let day = '';
    let month = '';
    if (dateObject.day.toString().length === 1) {
      day = '0' + dateObject.day;
    } else {
      day = dateObject.day.toString();
    }
    if (dateObject.month.toString().length === 1) {
      month = '0' + dateObject.month;
    } else {
      month = dateObject.month.toString();
    }

    if (time.hour.toString().length === 1) {
      this.localTimeHour = '0' + time.hour;
    } else {
      this.localTimeHour = time.hour.toString();
    }

    if (time.minute.toString().length === 1) {
      this.localTimeMinute = '0' + time.minute;
    } else {
      this.localTimeMinute = time.minute.toString();
    }

    return dateObject.year + '-' + month + '-' + day + 'T' + this.localTimeHour + ':' + this.localTimeMinute;
  }

  // formatTime(hours: number, minutes: number): number {
  //   return this.pad(hours, 2) this.pad(hours, 2);
  // }
  //
  // private pad(value: number, length: number): number {
  //    const s = (value + '').padStart(length, '0');
  //    return parseInt(s, 0);
  // }

}
