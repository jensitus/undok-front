import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCounselingComponent } from './show-counseling.component';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('ShowCounselingComponent', () => {
  let component: ShowCounselingComponent;
  let fixture: ComponentFixture<ShowCounselingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ShowCounselingComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();

    fixture = TestBed.createComponent(ShowCounselingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
