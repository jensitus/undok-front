import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClosedCaseBannerComponent} from './closed-case-banner.component';

import {defaultTestProviders} from '../../../../testing/test-providers';

import {Case} from '../../model/case';

describe('ClosedCaseBannerComponent', () => {
  let component: ClosedCaseBannerComponent;
  let fixture: ComponentFixture<ClosedCaseBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosedCaseBannerComponent],
      providers: [...defaultTestProviders()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosedCaseBannerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('closedCase', {
      id: 'case-1', name: 'case-01', status: 'CLOSED', clientId: 'client-1',
      startDate: '2026-01-10', endDate: '2026-03-04', referredTo: 'AK Wien'
    } as Case);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the end date and the referral', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('2026-03-04');
    expect(text).toContain('AK Wien');
  });
});
