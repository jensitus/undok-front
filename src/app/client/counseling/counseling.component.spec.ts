import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {CounselingComponent} from './counseling.component';
import {CounselingService} from '../service/counseling.service';
import {CategoryService} from '../service/category.service';
import {CommonService} from '../../common/services/common.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {DateTimeService} from '../service/date-time.service';
import {DurationService} from '../service/duration.service';
import {ActivatedRoute, Router, UrlTree} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {of, Subject, throwError} from 'rxjs';
import {Counseling} from '../model/counseling';
import {Category} from '../model/category';
import {CategoryTypes} from '../model/category-types';
import {signal} from '@angular/core';

describe('CounselingComponent', () => {
  let component: CounselingComponent;
  let fixture: ComponentFixture<CounselingComponent>;

  // Mock services
  let counselingServiceSpy: jasmine.SpyObj<CounselingService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let commonServiceSpy: jasmine.SpyObj<CommonService> & { reload: ReturnType<typeof signal>, delete: ReturnType<typeof signal> };
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let dateTimeServiceSpy: jasmine.SpyObj<DateTimeService>;
  let durationServiceSpy: jasmine.SpyObj<DurationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;

  // Test data
  const mockCounseling: Counseling = {
    id: 'counseling-123',
    counselingStatus: 'ACTIVE',
    entryDate: '2024-01-15T10:00:00',
    concern: 'Test concern text',
    activity: 'Test activity text',
    legalCategory: [],
    activityCategories: [],
    registeredBy: 'Test User',
    counselingDate: '2024-01-20T14:30:00',
    clientId: 'client-456',
    clientFullName: 'John Doe',
    comment: null,
    keyword: 'TEST-001',
    requiredTime: 90
  };

  const mockLegalCategories: Category[] = [
    {id: 'cat-1', name: 'Legal Cat 1', type: 'LEGAL'},
    {id: 'cat-2', name: 'Legal Cat 2', type: 'LEGAL'}
  ];

  const mockActivityCategories: Category[] = [
    {id: 'cat-3', name: 'Activity Cat 1', type: 'ACTIVITY'}
  ];

  beforeEach(async () => {
    // Create spies for all services
    counselingServiceSpy = jasmine.createSpyObj('CounselingService', [
      'getCounseling',
      'updateCounseling',
      'deleteCounseling',
      'setCounselingDuration'
    ]);

    categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'getCategoriesByTypeAndEntity',
      'addJoinCategories',
      'deleteJoinCategories',
      'getCategories'
    ]);

    // CommonService with signal mocks
    const reloadSignal = signal(false);
    const deleteSignal = signal(false);
    commonServiceSpy = {
      reload: reloadSignal,
      delete: deleteSignal,
      setReload: jasmine.createSpy('setReload').and.callFake((value: boolean) => reloadSignal.set(value)),
      setDelete: jasmine.createSpy('setDelete').and.callFake((value: boolean) => deleteSignal.set(value))
    } as any;

    alertServiceSpy = jasmine.createSpyObj('AlertService', ['error', 'success']);

    dateTimeServiceSpy = jasmine.createSpyObj('DateTimeService', ['mergeDateAndTime']);
    dateTimeServiceSpy.mergeDateAndTime.and.returnValue('2024-01-20T14:30:00');

    durationServiceSpy = jasmine.createSpyObj('DurationService', ['getCounselingsDurationForEditing']);
    durationServiceSpy.getCounselingsDurationForEditing.and.returnValue('01:30');

    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl'], {
      events: new Subject()
    });
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);
    routerSpy.serializeUrl.and.returnValue('');

    modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);

    // Default return values for service methods
    counselingServiceSpy.getCounseling.and.returnValue(of({...mockCounseling}));
    counselingServiceSpy.updateCounseling.and.returnValue(of({...mockCounseling}));
    counselingServiceSpy.deleteCounseling.and.returnValue(of(void 0));
    counselingServiceSpy.setCounselingDuration.and.returnValue(of({...mockCounseling}));

    categoryServiceSpy.getCategoriesByTypeAndEntity.and.callFake((type: string) => {
      if (type === CategoryTypes.LEGAL) {
        return of([...mockLegalCategories]);
      }
      return of([...mockActivityCategories]);
    });
    categoryServiceSpy.getCategories.and.returnValue(of([...mockLegalCategories, ...mockActivityCategories]));
    categoryServiceSpy.addJoinCategories.and.returnValue(of({}));
    categoryServiceSpy.deleteJoinCategories.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [CounselingComponent],
      providers: [
        {provide: CounselingService, useValue: counselingServiceSpy},
        {provide: CategoryService, useValue: categoryServiceSpy},
        {provide: CommonService, useValue: commonServiceSpy},
        {provide: AlertService, useValue: alertServiceSpy},
        {provide: DateTimeService, useValue: dateTimeServiceSpy},
        {provide: DurationService, useValue: durationServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: ActivatedRoute, useValue: {}}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounselingComponent);
    component = fixture.componentInstance;

    // Set required inputs using Angular 21 signal input API
    fixture.componentRef.setInput('counselingId', 'counseling-123');
    fixture.componentRef.setInput('clientId', 'client-456');
  });

  describe('Component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have required inputs set', () => {
      expect(component.counselingId()).toBe('counseling-123');
      expect(component.clientId()).toBe('client-456');
    });

    it('should initialize with default signal values', () => {
      expect(component.counseling()).toBeUndefined();
      expect(component.loading()).toBeFalse();
      expect(component.editConcern()).toBeFalse();
      expect(component.editActivity()).toBeFalse();
      expect(component.editActivityCategory()).toBeFalse();
      expect(component.editLegalCategory()).toBeFalse();
      expect(component.editCounselingDate()).toBeFalse();
      expect(component.editRequiredTime()).toBeFalse();
      expect(component.counselingDateRequired()).toBeFalse();
    });

    it('should load counseling data on init via effect', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(counselingServiceSpy.getCounseling).toHaveBeenCalledWith('counseling-123');
      expect(categoryServiceSpy.getCategoriesByTypeAndEntity).toHaveBeenCalledWith(CategoryTypes.LEGAL, 'counseling-123');
      expect(categoryServiceSpy.getCategoriesByTypeAndEntity).toHaveBeenCalledWith(CategoryTypes.ACTIVITY, 'counseling-123');
    }));

    it('should set counseling signal after loading', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const counseling = component.counseling();
      expect(counseling).toBeTruthy();
      expect(counseling?.id).toBe('counseling-123');
      expect(counseling?.legalCategory).toEqual(mockLegalCategories);
      expect(counseling?.activityCategories).toEqual(mockActivityCategories);
    }));

    it('should set counselingDuration after loading', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(durationServiceSpy.getCounselingsDurationForEditing).toHaveBeenCalledWith(90);
      expect(component.counselingDuration()).toBe('01:30');
    }));

    it('should navigate to client on getCounseling error', fakeAsync(() => {
      counselingServiceSpy.getCounseling.and.returnValue(throwError(() => new Error('Not found')));

      fixture.detectChanges();
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/clients', 'client-456']);
    }));
  });

  describe('Computed values', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('should calculate concernRemainingChars correctly', () => {
      const remaining = component.concernRemainingChars();
      expect(remaining).toBe(4080 - mockCounseling.concern.length);
    });

    it('should calculate activityRemainingChars correctly', () => {
      const remaining = component.activityRemainingChars();
      expect(remaining).toBe(4080 - mockCounseling.activity.length);
    });

    it('should return max length when concern is null', fakeAsync(() => {
      const counselingWithNullConcern = {...mockCounseling, concern: null as any};
      counselingServiceSpy.getCounseling.and.returnValue(of(counselingWithNullConcern));

      component['getCounseling']();
      tick();

      expect(component.concernRemainingChars()).toBe(4080);
    }));
  });

  describe('Toggle methods', () => {
    it('should toggle editConcern signal', () => {
      expect(component.editConcern()).toBeFalse();

      component.toggleEditConcern();
      expect(component.editConcern()).toBeTrue();

      component.toggleEditConcern();
      expect(component.editConcern()).toBeFalse();
    });

    it('should toggle editActivity signal', () => {
      expect(component.editActivity()).toBeFalse();

      component.toggleEditActivity();
      expect(component.editActivity()).toBeTrue();

      component.toggleEditActivity();
      expect(component.editActivity()).toBeFalse();
    });

    it('should toggle editActivityCategory signal', () => {
      expect(component.editActivityCategory()).toBeFalse();

      component.toggleEditActivityCategory();
      expect(component.editActivityCategory()).toBeTrue();

      component.toggleEditActivityCategory();
      expect(component.editActivityCategory()).toBeFalse();
    });

    it('should toggle editLegalCategory signal', () => {
      expect(component.editLegalCategory()).toBeFalse();

      component.toggleEditLegalCategory();
      expect(component.editLegalCategory()).toBeTrue();

      component.toggleEditLegalCategory();
      expect(component.editLegalCategory()).toBeFalse();
    });

    it('should toggle editCounselingDate signal', () => {
      expect(component.editCounselingDate()).toBeFalse();

      component.toggleEditCounselingDate();
      expect(component.editCounselingDate()).toBeTrue();

      component.toggleEditCounselingDate();
      expect(component.editCounselingDate()).toBeFalse();
    });

    it('should toggle editRequiredTime signal', () => {
      expect(component.editRequiredTime()).toBeFalse();

      component.toggleEditRequiredTime();
      expect(component.editRequiredTime()).toBeTrue();

      component.toggleEditRequiredTime();
      expect(component.editRequiredTime()).toBeFalse();
    });
  });

  describe('Update helper methods', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('should update counseling concern', () => {
      component.updateCounselingConcern('New concern text');

      expect(component.counseling()?.concern).toBe('New concern text');
    });

    it('should update counseling activity', () => {
      component.updateCounselingActivity('New activity text');

      expect(component.counseling()?.activity).toBe('New activity text');
    });

    it('should update dateObject', () => {
      const newDate = {year: 2024, month: 6, day: 15};
      component.updateDateObject(newDate);

      expect(component.dateObject()).toEqual(newDate);
    });

    it('should update time', () => {
      const newTime = {hour: 10, minute: 45};
      component.updateTime(newTime);

      expect(component.time()).toEqual(newTime);
    });

    it('should update time hour only', () => {
      component.updateTimeHour(18);

      expect(component.time().hour).toBe(18);
      expect(component.time().minute).toBe(30); // Original minute preserved
    });

    it('should update time minute only', () => {
      component.updateTimeMinute(45);

      expect(component.time().hour).toBe(14); // Set from mockCounseling date
      expect(component.time().minute).toBe(45);
    });

    it('should update counselingDuration', () => {
      component.updateCounselingDuration('02:15');

      expect(component.counselingDuration()).toBe('02:15');
    });
  });

  describe('update method', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('should call updateCounseling service', fakeAsync(() => {
      component.update('concern');
      tick();

      expect(counselingServiceSpy.updateCounseling).toHaveBeenCalledWith(
        'counseling-123',
        jasmine.any(Object)
      );
    }));

    it('should merge date and time when dateObject exists', fakeAsync(() => {
      component.updateDateObject({year: 2024, month: 3, day: 10});
      component.update('concern');
      tick();

      expect(dateTimeServiceSpy.mergeDateAndTime).toHaveBeenCalled();
    }));

    it('should reset all edit flags after update', fakeAsync(() => {
      component.editConcern.set(true);
      component.editActivity.set(true);
      component.editCounselingDate.set(true);

      component.update('concern');
      tick();

      expect(component.editConcern()).toBeFalse();
      expect(component.editActivity()).toBeFalse();
      expect(component.editCounselingDate()).toBeFalse();
      expect(component.editActivityCategory()).toBeFalse();
      expect(component.editLegalCategory()).toBeFalse();
    }));

    it('should set counselingDateRequired on 428 error', fakeAsync(() => {
      counselingServiceSpy.updateCounseling.and.returnValue(
        throwError(() => ({status: 428}))
      );

      component.update('concern');
      tick();

      expect(component.counselingDateRequired()).toBeTrue();
    }));

    it('should not call service when counseling is undefined', fakeAsync(() => {
      component.counseling.set(undefined);
      counselingServiceSpy.updateCounseling.calls.reset();

      component.update('concern');
      tick();

      expect(counselingServiceSpy.updateCounseling).not.toHaveBeenCalled();
    }));
  });

  describe('saveCategories method', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('should call deleteJoinCategories and addJoinCategories', fakeAsync(() => {
      component.showCategoryValue(
        [{itemId: 'new-cat-1', itemText: 'New Category'}],
        CategoryTypes.LEGAL
      );
      component.showDeSelected([{itemId: 'old-cat-1', itemText: 'Old Category'}]);

      component.saveCategories(CategoryTypes.LEGAL);
      tick();

      expect(categoryServiceSpy.deleteJoinCategories).toHaveBeenCalled();
      expect(categoryServiceSpy.addJoinCategories).toHaveBeenCalled();
    }));

    it('should fetch updated categories after saving', fakeAsync(() => {
      categoryServiceSpy.getCategoriesByTypeAndEntity.calls.reset();

      component.saveCategories(CategoryTypes.LEGAL);
      tick();

      expect(categoryServiceSpy.getCategoriesByTypeAndEntity).toHaveBeenCalledWith(
        CategoryTypes.LEGAL,
        'counseling-123'
      );
    }));

    it('should update counseling signal with new legal categories', fakeAsync(() => {
      const newLegalCategories = [{id: 'new-1', name: 'New Legal', type: 'LEGAL'}];
      categoryServiceSpy.getCategoriesByTypeAndEntity.and.callFake((type: string) => {
        if (type === CategoryTypes.LEGAL) {
          return of(newLegalCategories);
        }
        return of(mockActivityCategories);
      });

      component.saveCategories(CategoryTypes.LEGAL);
      tick();

      expect(component.counseling()?.legalCategory).toEqual(newLegalCategories);
    }));

    it('should update counseling signal with new activity categories', fakeAsync(() => {
      const newActivityCategories = [{id: 'new-2', name: 'New Activity', type: 'ACTIVITY'}];
      categoryServiceSpy.getCategoriesByTypeAndEntity.and.callFake((type: string) => {
        if (type === CategoryTypes.ACTIVITY) {
          return of(newActivityCategories);
        }
        return of(mockLegalCategories);
      });

      component.saveCategories(CategoryTypes.ACTIVITY);
      tick();

      expect(component.counseling()?.activityCategories).toEqual(newActivityCategories);
    }));

    it('should toggle editLegalCategory after saving legal categories', fakeAsync(() => {
      component.editLegalCategory.set(true);

      component.saveCategories(CategoryTypes.LEGAL);
      tick();

      expect(component.editLegalCategory()).toBeFalse();
    }));

    it('should toggle editActivityCategory after saving activity categories', fakeAsync(() => {
      component.editActivityCategory.set(true);

      component.saveCategories(CategoryTypes.ACTIVITY);
      tick();

      expect(component.editActivityCategory()).toBeFalse();
    }));

    it('should reset joinCategories and deSelectedCategories arrays', fakeAsync(() => {
      component.showCategoryValue(
        [{itemId: 'cat-1', itemText: 'Cat 1'}],
        CategoryTypes.LEGAL
      );
      component.showDeSelected([{itemId: 'cat-2', itemText: 'Cat 2'}]);

      component.saveCategories(CategoryTypes.LEGAL);
      tick();

      expect(component.joinCategories).toEqual([]);
      expect(component.deSelectedCategories).toEqual([]);
    }));

    it('should not call services when counseling is undefined', fakeAsync(() => {
      component.counseling.set(undefined);
      categoryServiceSpy.deleteJoinCategories.calls.reset();
      categoryServiceSpy.addJoinCategories.calls.reset();

      component.saveCategories(CategoryTypes.LEGAL);
      tick();

      expect(categoryServiceSpy.deleteJoinCategories).not.toHaveBeenCalled();
      expect(categoryServiceSpy.addJoinCategories).not.toHaveBeenCalled();
    }));
  });

  describe('saveRequiredTime method', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('should call setCounselingDuration with correct minutes', fakeAsync(() => {
      component.updateCounselingDuration('02:30');

      component.saveRequiredTime();
      tick();

      // 2 hours * 60 + 30 minutes = 150
      expect(counselingServiceSpy.setCounselingDuration).toHaveBeenCalledWith(
        'counseling-123',
        150
      );
    }));

    it('should toggle editRequiredTime on success', fakeAsync(() => {
      component.editRequiredTime.set(true);

      component.saveRequiredTime();
      tick();

      expect(component.editRequiredTime()).toBeFalse();
    }));
  });

  describe('Delete counseling', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('should call deleteCounseling service on yes', fakeAsync(() => {
      component.yes('counseling-123');
      tick();

      expect(counselingServiceSpy.deleteCounseling).toHaveBeenCalledWith('counseling-123');
    }));

    it('should navigate to client after successful deletion', fakeAsync(() => {
      component.yes('counseling-123');
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/clients', 'client-456']);
      expect(modalServiceSpy.dismissAll).toHaveBeenCalled();
    }));

    it('should show error alert on deletion failure', fakeAsync(() => {
      counselingServiceSpy.deleteCounseling.and.returnValue(
        throwError(() => new Error('Delete failed'))
      );

      component.yes('counseling-123');
      tick();

      expect(alertServiceSpy.error).toHaveBeenCalledWith("sorry, that didn't work");
    }));

    it('should dismiss modal on no', () => {
      component.no();

      expect(modalServiceSpy.dismissAll).toHaveBeenCalled();
    });
  });

  describe('Modal methods', () => {
    it('should open delete confirmation modal', () => {
      const mockModalRef = {
        result: Promise.resolve('closed')
      } as NgbModalRef;
      modalServiceSpy.open.and.returnValue(mockModalRef);

      const content = {};
      component.openDeleteConfirmationModal(content);

      expect(modalServiceSpy.open).toHaveBeenCalledWith(content, {ariaLabelledBy: 'modal-basic-title'});
    });

    it('should open edit counseling modal with xl size', () => {
      const mockModalRef = {
        result: Promise.resolve('closed')
      } as NgbModalRef;
      modalServiceSpy.open.and.returnValue(mockModalRef);

      const content = {};
      component.openEditCounseling(content);

      expect(modalServiceSpy.open).toHaveBeenCalledWith(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl'
      });
    });

    it('should close comment modal and refresh counseling', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      counselingServiceSpy.getCounseling.calls.reset();

      component.closeCommentModal();
      tick();

      expect(counselingServiceSpy.getCounseling).toHaveBeenCalled();
      expect(modalServiceSpy.dismissAll).toHaveBeenCalled();
    }));
  });

  describe('showCategoryValue method', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('should map dropdown items to join categories', () => {
      const dropdownItems = [
        {itemId: 'cat-1', itemText: 'Category 1'},
        {itemId: 'cat-2', itemText: 'Category 2'}
      ];

      component.showCategoryValue(dropdownItems, CategoryTypes.LEGAL);

      expect(component.joinCategories.length).toBe(2);
      expect(component.joinCategories[0].categoryId).toBe('cat-1');
      expect(component.joinCategories[0].categoryType).toBe(CategoryTypes.LEGAL);
      expect(component.joinCategories[0].entityId).toBe('counseling-123');
      expect(component.joinCategories[0].entityType).toBe('COUNSELING');
    });

    it('should not modify joinCategories when counseling is undefined', () => {
      component.counseling.set(undefined);
      component.joinCategories = [];

      component.showCategoryValue([{itemId: 'cat-1', itemText: 'Cat'}], CategoryTypes.LEGAL);

      expect(component.joinCategories.length).toBe(0);
    });
  });

  describe('showDeSelected method', () => {
    it('should set deSelectedItems', () => {
      const items = [{itemId: 'cat-1', itemText: 'Cat 1'}];

      component.showDeSelected(items);

      expect(component.deSelectedItems).toEqual(items);
    });
  });

  describe('Date object parsing', () => {
    it('should correctly parse counselingDate to dateObject and time', fakeAsync(() => {
      const counselingWithDate = {
        ...mockCounseling,
        counselingDate: '2024-06-15T09:45:00'
      };
      counselingServiceSpy.getCounseling.and.returnValue(of(counselingWithDate));

      fixture.detectChanges();
      tick();

      expect(component.dateObject()).toEqual({year: 2024, month: 6, day: 15});
      expect(component.time()).toEqual({hour: 9, minute: 45});
    }));

    it('should not set dateObject when counselingDate is null', fakeAsync(() => {
      const counselingWithoutDate = {
        ...mockCounseling,
        counselingDate: null as any
      };
      counselingServiceSpy.getCounseling.and.returnValue(of(counselingWithoutDate));

      fixture.detectChanges();
      tick();

      // dateObject should remain at its initial state
      expect(component.dateObject()).toBeUndefined();
    }));
  });
});
