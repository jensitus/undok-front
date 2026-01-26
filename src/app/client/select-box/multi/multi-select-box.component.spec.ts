import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectBoxComponent } from './multi-select-box.component';

describe('MultiSelectBoxComponent', () => {
  let component: MultiSelectBoxComponent;
  let fixture: ComponentFixture<MultiSelectBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MultiSelectBoxComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(MultiSelectBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
