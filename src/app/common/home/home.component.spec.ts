import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [HomeComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
