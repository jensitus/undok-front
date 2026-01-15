import { Injectable, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Modern signal-based state management
  private readonly _clientButtons = signal<boolean>(false);
  private readonly _newCounseling = signal<boolean>(false);
  private readonly _clientIdForCreateCounseling = signal<string | null>(null);
  private readonly _newEmployer = signal<boolean>(false);
  private readonly _assignEmployer = signal<boolean>(false);
  private readonly _editClient = signal<boolean>(false);
  private readonly _createEmployerButton = signal<boolean>(false);

  // Public readonly signals
  readonly clientButtons: Signal<boolean> = this._clientButtons.asReadonly();
  readonly newCounseling: Signal<boolean> = this._newCounseling.asReadonly();
  readonly clientIdForCreateCounseling: Signal<string | null> = this._clientIdForCreateCounseling.asReadonly();
  readonly newEmployer: Signal<boolean> = this._newEmployer.asReadonly();
  readonly assignEmployer: Signal<boolean> = this._assignEmployer.asReadonly();
  readonly editClient: Signal<boolean> = this._editClient.asReadonly();
  readonly createEmployerButton: Signal<boolean> = this._createEmployerButton.asReadonly();

  // Setter methods for state updates
  setClientButtons(value: boolean): void {
    this._clientButtons.set(!!value);
  }

  setClientIdForCreateCounseling(value: string | null): void {
    this._clientIdForCreateCounseling.set(value);
  }

  // setNewCounseling(value: boolean): void {
  //   this._newCounseling.set(!!value);
  // }
  //
  // setNewEmployer(value: boolean): void {
  //   this._newEmployer.set(!!value);
  // }

  setAssignEmployer(value: boolean): void {
    this._assignEmployer.set(!!value);
  }

  // setEditClient(value: boolean): void {
  //   this._editClient.set(!!value);
  // }

  setCreateEmployerButton(value: boolean): void {
    this._createEmployerButton.set(!!value);
  }
}
