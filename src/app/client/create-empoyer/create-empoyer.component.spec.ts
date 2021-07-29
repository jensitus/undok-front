import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmpoyerComponent } from './create-empoyer.component';

describe('CreateEmpoyerComponent', () => {
  let component: CreateEmpoyerComponent;
  let fixture: ComponentFixture<CreateEmpoyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEmpoyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmpoyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
