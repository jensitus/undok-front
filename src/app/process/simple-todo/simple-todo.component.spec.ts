import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTodoComponent } from './simple-todo.component';

describe('SimpleTodoComponent', () => {
  let component: SimpleTodoComponent;
  let fixture: ComponentFixture<SimpleTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
