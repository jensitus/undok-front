import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeaderComponent } from './page-header.component';

import {defaultTestProviders} from '../../../../testing/test-providers';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
      providers: [...defaultTestProviders()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('firstPoint', 'dashboard');
    fixture.componentRef.setInput('endPoint', 'edit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
