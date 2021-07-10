import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCounselingsPerClientComponent } from './show-counselings-per-client.component';

describe('ShowCounselingsPerClientComponent', () => {
  let component: ShowCounselingsPerClientComponent;
  let fixture: ComponentFixture<ShowCounselingsPerClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCounselingsPerClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCounselingsPerClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
