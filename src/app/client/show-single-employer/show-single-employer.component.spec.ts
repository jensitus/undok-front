import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSingleEmployerComponent } from './show-single-employer.component';

describe('ShowSingleEmployerComponent', () => {
  let component: ShowSingleEmployerComponent;
  let fixture: ComponentFixture<ShowSingleEmployerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ShowSingleEmployerComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSingleEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
