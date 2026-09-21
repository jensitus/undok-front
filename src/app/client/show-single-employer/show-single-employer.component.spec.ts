import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSingleEmployerComponent } from './show-single-employer.component';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('ShowSingleEmployerComponent', () => {
  let component: ShowSingleEmployerComponent;
  let fixture: ComponentFixture<ShowSingleEmployerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ShowSingleEmployerComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSingleEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
