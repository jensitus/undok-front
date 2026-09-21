import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEmployersComponent } from './show-employers.component';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('ShowEmployersComponent', () => {
  let component: ShowEmployersComponent;
  let fixture: ComponentFixture<ShowEmployersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ShowEmployersComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowEmployersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
