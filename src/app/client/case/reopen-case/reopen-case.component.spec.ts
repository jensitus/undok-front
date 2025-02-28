import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReopenCaseComponent } from './reopen-case.component';

describe('ReopenCaseComponent', () => {
  let component: ReopenCaseComponent;
  let fixture: ComponentFixture<ReopenCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReopenCaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReopenCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
