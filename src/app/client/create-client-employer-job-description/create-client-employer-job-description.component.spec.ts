import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientEmployerJobDescriptionComponent } from './create-client-employer-job-description.component';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('CreateClientEmployerJobDescriptionComponent', () => {
  let component: CreateClientEmployerJobDescriptionComponent;
  let fixture: ComponentFixture<CreateClientEmployerJobDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateClientEmployerJobDescriptionComponent],
      providers: [...defaultTestProviders()]
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
