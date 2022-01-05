import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  public clientButtonSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public newCounselingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public newEmployerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  setClientButtonSubject(value) {
    if (value) {
      this.clientButtonSubject.next(value);
    } else {
      this.clientButtonSubject.next(null);
    }
  }

  setNewCounselingSubject(value) {
    if (value) {
      this.newCounselingSubject.next(value);
    } else {
      this.newCounselingSubject.next(null);
    }
  }

  setNewEmployerSubject(value) {
    if (value) {
      this.newEmployerSubject.next(value);
    } else {
      this.newEmployerSubject.next(null);
    }
  }

}
