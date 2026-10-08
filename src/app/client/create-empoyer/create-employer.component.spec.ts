import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployerComponent } from './create-employer.component';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('CreateEmpoyerComponent', () => {
  let component: CreateEmployerComponent;
  let fixture: ComponentFixture<CreateEmployerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateEmployerComponent],
      providers: [...defaultTestProviders()]
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
