import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackUpComponent } from './back-up.component';

describe('BackUpComponent', () => {
  let component: BackUpComponent;
  let fixture: ComponentFixture<BackUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BackUpComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(BackUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
