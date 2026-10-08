import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactorComponent } from './two-factor.component';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('TwoFactorComponent', () => {
  let component: TwoFactorComponent;
  let fixture: ComponentFixture<TwoFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TwoFactorComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
