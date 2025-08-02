import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  public clientButtonSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public newCounselingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public clientIdForCreateCounselingSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public newEmployerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public assignEmployerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public editClientSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public createEmployerButtonSubject: BehaviorSubject<boolean>  = new BehaviorSubject<boolean>(null);

  setClientButtonSubject(value) {
    if (value) {
      this.clientButtonSubject.next(value);
    } else {
      this.clientButtonSubject.next(null);
    }
  }

  setClientIdForCreateCounselingSubject(value) {
    if (value) {
      this.clientIdForCreateCounselingSubject.next(value);
    } else {
      this.clientIdForCreateCounselingSubject.next(null);
    }
  }

  setNewCounselingSubject(value) {
    console.log('value', value);
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

  setAssignEmployerSubject(value) {
    if (value) {
      this.assignEmployerSubject.next(value);
    } else {
      this.assignEmployerSubject.next(null);
    }
  }

  setCreateEmployerButtonSubject(value) {
    if (value) {
      this.createEmployerButtonSubject.next(value);
    } else {
      this.createEmployerButtonSubject.next(null);
    }
  }

}
