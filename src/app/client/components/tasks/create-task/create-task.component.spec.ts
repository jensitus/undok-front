import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaskComponent } from './create-task.component';

import {defaultTestProviders} from '../../../../../testing/test-providers';

describe('CreateTaskComponent', () => {
  let component: CreateTaskComponent;
  let fixture: ComponentFixture<CreateTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTaskComponent],
      providers: [...defaultTestProviders()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
