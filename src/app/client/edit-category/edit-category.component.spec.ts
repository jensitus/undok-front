import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoryComponent } from './edit-category.component';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('EditCategoryComponent', () => {
  let component: EditCategoryComponent;
  let fixture: ComponentFixture<EditCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditCategoryComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();

    fixture = TestBed.createComponent(EditCategoryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categoryId', 'category-1');
    fixture.componentRef.setInput('categoryName', 'Asyl');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
