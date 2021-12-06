import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEmployersComponent } from './show-employers.component';

describe('ShowEmployersComponent', () => {
  let component: ShowEmployersComponent;
  let fixture: ComponentFixture<ShowEmployersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowEmployersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowEmployersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
