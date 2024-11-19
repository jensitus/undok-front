import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DurationService {

  constructor() { }

  getCounselingDuration(requiredTime: number): string {
    if (requiredTime) {
      return Math.floor(requiredTime / 60) + 'h ' +  Math.floor(requiredTime % 60) + 'min';
    } else {
      return '';
    }
  }

  getCounselingsDurationForEditing(requiredTime: number): string {
    if (requiredTime) {
      return this.addLeadingZeros(Math.floor(requiredTime / 60), 2) + ':' +  Math.floor(requiredTime % 60);
    } else {
      return '';
    }
  }

  addLeadingZeros(num, length) {
    return String(num).padStart(length, '0');
  }

}
