import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientEmployerJobDescriptionComponent } from './edit-client-employer-job-description.component';

describe('EditClientEmployerJobDescriptionComponent', () => {
  let component: EditClientEmployerJobDescriptionComponent;
  let fixture: ComponentFixture<EditClientEmployerJobDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditClientEmployerJobDescriptionComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClientEmployerJobDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
