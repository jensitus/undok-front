import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoriesComponent } from './edit-categories.component';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('EditCategoriesComponent', () => {
  let component: EditCategoriesComponent;
  let fixture: ComponentFixture<EditCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditCategoriesComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();

    fixture = TestBed.createComponent(EditCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
