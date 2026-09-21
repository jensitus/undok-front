import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelineComponent } from './timeline.component';

import {defaultTestProviders} from '../../../../../../testing/test-providers';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [TimelineComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
