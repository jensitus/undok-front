import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackUpComponent } from './back-up.component';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('BackUpComponent', () => {
  let component: BackUpComponent;
  let fixture: ComponentFixture<BackUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BackUpComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();

    fixture = TestBed.createComponent(BackUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
