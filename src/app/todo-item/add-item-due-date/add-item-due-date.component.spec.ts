import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemDueDateComponent } from './add-item-due-date.component';

describe('AddItemDueDateComponent', () => {
  let component: AddItemDueDateComponent;
  let fixture: ComponentFixture<AddItemDueDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemDueDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemDueDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
