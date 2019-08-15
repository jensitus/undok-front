import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckVariableComponent } from './check-variable.component';

describe('CheckVariableComponent', () => {
  let component: CheckVariableComponent;
  let fixture: ComponentFixture<CheckVariableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckVariableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
