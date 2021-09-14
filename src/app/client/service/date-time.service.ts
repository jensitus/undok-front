import { Injectable } from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  time = {hour: 13, minute: 30};
  dateObject: NgbDateStruct;

  constructor() { }

  mergeDateAndTime(dateObject: NgbDateStruct): string {
    let day = '';
    let month = '';
    console.log(dateObject);
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
    const finalDateTimeDonner = day + '-' + month + '-' + dateObject.year + ' ' + this.time.hour + ':' + this.time.minute;
    console.log(finalDateTimeDonner);
    return finalDateTimeDonner;
  }

}
