import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEmployersListComponent } from './show-employers-list.component';

describe('ShowEmployersListComponent', () => {
  let component: ShowEmployersListComponent;
  let fixture: ComponentFixture<ShowEmployersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowEmployersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowEmployersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
