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

    return day + '-' + month + '-' + dateObject.year + ' ' + this.localTimeHour + ':' + this.localTimeMinute;
  }

}
