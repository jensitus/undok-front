import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {Subject} from 'rxjs';

import {SelectBoxComponent} from './select-box.component';
import {CategoryService} from '../../service/category.service';
import {CommonService} from '../../../common/services/common.service';
import {CategoryTypes} from '../../model/category-types';
import {Category} from '../../model/category';

/**
 * The Aufenthaltstitel box is bound to a whole Category (it needs the id for join_category),
 * unlike the boxes still bound to a plain string column. If that object reaches ng-select
 * before the category list has loaded, ng-select cannot resolve a label for it — the box then
 * renders blank although a value is selected. Guards against that regression.
 */
describe('SelectBoxComponent preselection', () => {

  const CATEGORIES = [
    {id: '1', name: 'Asyl', type: 'Aufenthaltstitel'},
    {id: '2', name: 'Rot-Weiss-Rot', type: 'Aufenthaltstitel'},
  ] as Category[];

  @Component({
    standalone: true,
    imports: [SelectBoxComponent],
    template: `
      <app-select-box [categoryType]="type" [cat_model]="model()" [label]="label"
                      (catValue)="emittedValue = $event; valueEmitted = true"
                      (catObject)="emittedObject = $event; objectEmitted = true"></app-select-box>`
  })
  class HostComponent {
    type = CategoryTypes.AUFENTHALTSTITEL;
    label: any = 'Aufenthaltstitel';
    model = signal<any>(null);
    emittedValue: any;
    emittedObject: any;
    valueEmitted = false;
    objectEmitted = false;
  }

  let categories$: Subject<Category[]>;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    categories$ = new Subject<Category[]>();
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        {provide: CategoryService, useValue: {getCategories: () => categories$}},
        {provide: CommonService, useValue: {reload: signal(false)}},
      ]
    });
    fixture = TestBed.createComponent(HostComponent);
  });

  const selectedLabel = () =>
    (fixture.nativeElement.querySelector('.ng-value-label')?.textContent ?? '').trim();

  // detectChanges(false): ng-select refreshes its item list from within change detection,
  // which trips the check-no-changes pass in dev mode.
  const settle = () => {
    fixture.detectChanges(false);
    tick();
    fixture.detectChanges(false);
  };

  it('shows a preselected category that was bound before the categories loaded', fakeAsync(() => {
    // a different object instance with the same id — the client GET and the category GET are
    // separate responses
    fixture.componentInstance.model.set({id: '2', name: 'Rot-Weiss-Rot', type: 'Aufenthaltstitel'});
    settle();
    expect(selectedLabel()).toBe('Rot-Weiss-Rot');

    categories$.next(CATEGORIES);
    settle();
    expect(selectedLabel()).toBe('Rot-Weiss-Rot');
  }));

  it('shows a preselected category that was bound after the categories loaded', fakeAsync(() => {
    fixture.detectChanges(false);
    categories$.next(CATEGORIES);
    settle();

    fixture.componentInstance.model.set({id: '2', name: 'Rot-Weiss-Rot', type: 'Aufenthaltstitel'});
    settle();
    expect(selectedLabel()).toBe('Rot-Weiss-Rot');
  }));

  it('deselects instead of throwing when the clear button is used', fakeAsync(() => {
    fixture.componentInstance.model.set(CATEGORIES[1]);
    settle();
    categories$.next(CATEGORIES);
    settle();
    expect(selectedLabel()).toBe('Rot-Weiss-Rot');

    const clear: HTMLElement = fixture.nativeElement.querySelector('.ng-clear-wrapper');
    expect(clear).withContext('clear button rendered').toBeTruthy();
    clear.click();
    settle();

    expect(selectedLabel()).toBe('');
    expect(fixture.componentInstance.valueEmitted).toBeTrue();
    expect(fixture.componentInstance.emittedValue).toBeNull();
    expect(fixture.componentInstance.objectEmitted).toBeTrue();
    expect(fixture.componentInstance.emittedObject).toBeFalsy();
  }));

  it('shows a plain string model, as used by the boxes not yet migrated to join_category', fakeAsync(() => {
    fixture.componentInstance.model.set('Rot-Weiss-Rot');
    settle();
    expect(selectedLabel()).toBe('Rot-Weiss-Rot');

    categories$.next(CATEGORIES);
    settle();
    expect(selectedLabel()).toBe('Rot-Weiss-Rot');
  }));
});
