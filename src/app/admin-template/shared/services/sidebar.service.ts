import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  public clientButtonSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public newCounselingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  setClientButtonSubject(value) {
    console.log('clientButtonSubject', value);
    if (value) {
      this.clientButtonSubject.next(value);
    } else {
      this.clientButtonSubject.next(null);
    }
  }

  setNewCounselingSubject(value) {
    console.log('newCounselingSubject');
    if (value) {
      this.newCounselingSubject.next(value);
    } else {
      this.newCounselingSubject.next(null);
    }
  }

}
