import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCounselingComponent } from './create-counseling.component';

describe('CreateCounselingComponent', () => {
  let component: CreateCounselingComponent;
  let fixture: ComponentFixture<CreateCounselingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCounselingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCounselingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
