import {Injectable} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Time} from '../model/time';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  dateObject: NgbDateStruct;

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
    return day + '-' + month + '-' + dateObject.year + ' ' + time.hour + ':' + time.minute;
  }

}
