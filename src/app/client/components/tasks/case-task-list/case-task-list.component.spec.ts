import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTaskListComponent } from './case-task-list.component';

import {defaultTestProviders} from '../../../../../testing/test-providers';

describe('CaseTaskListComponent', () => {
  let component: CaseTaskListComponent;
  let fixture: ComponentFixture<CaseTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseTaskListComponent],
      providers: [...defaultTestProviders()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseTaskListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('caseId', 'case-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
