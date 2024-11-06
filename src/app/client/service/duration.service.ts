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

  addLeadingZeros(num, length) {
    return String(num).padStart(length, '0');
  }

}
