import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RegisterComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
