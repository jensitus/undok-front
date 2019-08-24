import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetVariableCheckBoxComponent } from './set-variable-check-box.component';

describe('CheckVariableComponent', () => {
  let component: SetVariableCheckBoxComponent;
  let fixture: ComponentFixture<SetVariableCheckBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetVariableCheckBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetVariableCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
