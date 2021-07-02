import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSingleClientComponent } from './show-single-client.component';

describe('ShowSingleClientComponent', () => {
  let component: ShowSingleClientComponent;
  let fixture: ComponentFixture<ShowSingleClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowSingleClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSingleClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
