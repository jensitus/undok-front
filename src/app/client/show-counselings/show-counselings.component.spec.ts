import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCounselingsComponent } from './show-counselings.component';

describe('ShowCounselingsComponent', () => {
  let component: ShowCounselingsComponent;
  let fixture: ComponentFixture<ShowCounselingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCounselingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCounselingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
