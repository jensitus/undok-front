import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployerComponent } from './edit-employer.component';

import {defaultTestProviders} from '../../../testing/test-providers';

import {Employer} from '../model/employer';
describe('EditEmployerComponent', () => {
  let component: EditEmployerComponent;
  let fixture: ComponentFixture<EditEmployerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditEmployerComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('employer', {id: 'employer-1', firstName: 'ACME', street: '', zipCode: '', city: ''} as Employer);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
