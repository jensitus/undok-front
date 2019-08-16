import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishTodoComponent } from './finish-todo.component';

describe('FinishTodoComponent', () => {
  let component: FinishTodoComponent;
  let fixture: ComponentFixture<FinishTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
