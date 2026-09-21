import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserComponent } from './create-user.component';

import {defaultTestProviders} from '../../../../../../../testing/test-providers';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateUserComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
