import {Injectable} from '@angular/core';
import {NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Time} from '../model/time';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

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

  /**
   * yyyy-MM-dd, which is what Jackson binds to a LocalDate. NgbFormatterService.format emits
   * dd/MM/yyyy and is for display only.
   */
  toIsoDate(dateObject: NgbDateStruct): string | null {
    if (!dateObject) {
      return null;
    }
    const month = dateObject.month.toString().padStart(2, '0');
    const day = dateObject.day.toString().padStart(2, '0');
    return dateObject.year + '-' + month + '-' + day;
  }

  convertToNgbDate(dateString: string): NgbDate | null {
    if (!dateString) { return null; }

    // Parse the date string
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) { return null; }

    // Return the NgbDateStruct object
    return {
      after(other?: NgbDate | null): boolean {
        return false;
      }, before(other?: NgbDate | null): boolean {
        return false;
      }, equals(other?: NgbDate | null): boolean {
        return false;
      },
      year: date.getFullYear(),
      month: date.getMonth() + 1, // JavaScript months are 0-indexed
      day: date.getDate()
    };
  }

}
