import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSingleTaskComponent } from './show-single-task.component';

describe('ShowSingleTaskComponent', () => {
  let component: ShowSingleTaskComponent;
  let fixture: ComponentFixture<ShowSingleTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowSingleTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowSingleTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
