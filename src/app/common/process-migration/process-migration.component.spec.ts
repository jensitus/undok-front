import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessMigrationComponent } from './process-migration.component';

describe('ProcessMigrationComponent', () => {
  let component: ProcessMigrationComponent;
  let fixture: ComponentFixture<ProcessMigrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessMigrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessMigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
