import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientEmployerJobDescriptionComponent } from './create-client-employer-job-description.component';

describe('CreateClientEmployerJobDescriptionComponent', () => {
  let component: CreateClientEmployerJobDescriptionComponent;
  let fixture: ComponentFixture<CreateClientEmployerJobDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateClientEmployerJobDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClientEmployerJobDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
