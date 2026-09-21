import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClientFormComponent} from './client-form.component';

import {defaultTestProviders} from '../../../testing/test-providers';
import {Client} from '../model/client';
import {Case} from '../model/case';
import {CategoryTypes} from '../model/category-types';

describe('ClientFormComponent', () => {
  let component: ClientFormComponent;
  let fixture: ComponentFixture<ClientFormComponent>;

  const clientWith = (openCase: Case | null, closedCases: Case[] = []): Client => ({
    id: 'client-1',
    keyword: 'kw-1',
    openCase,
    closedCases
  } as Client);

  const aCase = (id: string, overrides: Partial<Case> = {}): Case => ({
    id,
    name: 'case-' + id,
    status: 'CLOSED',
    clientId: 'client-1',
    ...overrides
  } as Case);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFormComponent],
      providers: [...defaultTestProviders()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showCategoryValue', () => {
    it('records the selection against the open case', () => {
      fixture.componentRef.setInput('client', clientWith({id: 'case-1'} as Case));
      const form = component.initializeClientForm();

      component.showCategoryValue(['cat-1'], CategoryTypes.UNDOCUMENTED_WORK, form);

      expect(form.undocumentedWorkSelected).toEqual([{
        categoryId: 'cat-1',
        categoryType: CategoryTypes.UNDOCUMENTED_WORK,
        entityId: 'case-1',
        entityType: 'CASE'
      } as any]);
    });

    it('does nothing when the case is closed, instead of throwing on openCase.id', () => {
      fixture.componentRef.setInput('client', clientWith(null));
      const form = component.initializeClientForm();

      expect(() => component.showCategoryValue(['cat-1'], CategoryTypes.UNDOCUMENTED_WORK, form))
        .not.toThrow();
      // Left undefined rather than [], so the backend skips this category type instead of
      // reading an empty list as a deselect-all and wiping the closed case's rows.
      expect(form.undocumentedWorkSelected).toBeUndefined();
    });
  });

  describe('displayCase', () => {
    it('shows the open case when there is one', () => {
      const open = aCase('open-1', {status: 'OPEN'});
      fixture.componentRef.setInput('client', clientWith(open, [aCase('closed-1')]));

      expect(component.displayCase()).toBe(open);
      expect(component.caseIsClosed()).toBeFalse();
    });

    it('falls back to the most recently closed case so the values stay visible', () => {
      const older = aCase('closed-1', {endDate: '2026-01-31'});
      const latest = aCase('closed-2', {endDate: '2026-06-30'});
      // The backend orders closed cases oldest first, so the last one is the most recent.
      fixture.componentRef.setInput('client', clientWith(null, [older, latest]));

      expect(component.displayCase()).toBe(latest);
      expect(component.caseIsClosed()).toBeTrue();
    });

    it('is not "closed" for a client that never had a case at all', () => {
      fixture.componentRef.setInput('client', clientWith(null, []));

      expect(component.displayCase()).toBeNull();
      expect(component.caseIsClosed()).toBeFalse();
    });
  });

  describe('when the case is closed', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('client', clientWith(null, [aCase('closed-1', {
        targetGroup: 'Zielgruppe A',
        workingRelationship: 'Angestellt',
        humanTrafficking: true,
        undocumentedWork: [{id: 'cat-9', name: 'Schwarzarbeit'}]
      } as Partial<Case>)]));
      fixture.detectChanges();
    });

    it('still shows the closed case values in the form', () => {
      const form = component.mapClient(component.client());

      expect(form.targetGroup).toBe('Zielgruppe A');
      expect(form.workingRelationship).toBe('Angestellt');
      expect(form.humanTrafficking).toBeTrue();
    });

    it('fills the category models from the closed case', () => {
      component.fillNgModels(component.client());

      expect(component.undocumentedWorkModel()).toEqual(['cat-9']);
    });

    it('renders the hint', () => {
      const text = (fixture.nativeElement as HTMLElement).textContent;
      expect(text).toContain('Fall ist abgeschlossen');
    });
  });
});
