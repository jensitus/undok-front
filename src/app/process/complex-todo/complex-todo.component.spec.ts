import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexTodoComponent } from './complex-todo.component';

describe('ComplexTodoComponent', () => {
  let component: ComplexTodoComponent;
  let fixture: ComponentFixture<ComplexTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplexTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
