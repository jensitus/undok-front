import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowClientsComponent } from './show-clients.component';

describe('ShowClientsComponent', () => {
  let component: ShowClientsComponent;
  let fixture: ComponentFixture<ShowClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
