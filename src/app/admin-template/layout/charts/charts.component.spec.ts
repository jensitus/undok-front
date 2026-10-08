import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsComponent } from './charts.component';

import {defaultTestProviders} from '../../../../testing/test-providers';

describe('ChartsComponent', () => {
  let component: ChartsComponent;
  let fixture: ComponentFixture<ChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsComponent],
      providers: [...defaultTestProviders()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
