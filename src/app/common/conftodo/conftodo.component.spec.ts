import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConftodoComponent } from './conftodo.component';

describe('ConftodoComponent', () => {
  let component: ConftodoComponent;
  let fixture: ComponentFixture<ConftodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConftodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConftodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
