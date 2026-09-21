import {TestBed} from '@angular/core/testing';

import {DateTimeService} from './date-time.service';

describe('DateTimeService', () => {
  let service: DateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateTimeService);
  });

  describe('toIsoDate', () => {
    it('pads month and day so Jackson can bind it to a LocalDate', () => {
      expect(service.toIsoDate({year: 2026, month: 3, day: 4})).toBe('2026-03-04');
    });

    it('leaves two-digit month and day alone', () => {
      expect(service.toIsoDate({year: 2026, month: 12, day: 31})).toBe('2026-12-31');
    });

    it('returns null for no date', () => {
      expect(service.toIsoDate(null)).toBeNull();
    });
  });
});
