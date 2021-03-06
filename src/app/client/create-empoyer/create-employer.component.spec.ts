import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployerComponent } from './create-employer.component';

describe('CreateEmpoyerComponent', () => {
  let component: CreateEmployerComponent;
  let fixture: ComponentFixture<CreateEmployerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEmployerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
