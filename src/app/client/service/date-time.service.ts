import { Injectable } from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  time = {hour: 13, minute: 30};
  dateObject: NgbDateStruct;

  constructor() { }

  mergeDateAndTime(): string {
    let day = '';
    let month = '';
    if (this.dateObject.day.toString().length === 1) {
      day = '0' + this.dateObject.day;
    } else {
      day = this.dateObject.day.toString();
    }
    if (this.dateObject.month.toString().length === 1) {
      month = '0' + this.dateObject.month;
    } else {
      month = this.dateObject.month.toString();
    }
    const finalDateTimeDonner = day + '-' + month + '-' + this.dateObject.year + ' ' + this.time.hour + ':' + this.time.minute;
    console.log(finalDateTimeDonner);
    return finalDateTimeDonner;
  }

}
