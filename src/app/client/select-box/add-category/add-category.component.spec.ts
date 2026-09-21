import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryComponent } from './add-category.component';

import {defaultTestProviders} from '../../../../testing/test-providers';

import {CategoryTypes} from '../../model/category-types';
describe('AddCategoryComponent', () => {
  let component: AddCategoryComponent;
  let fixture: ComponentFixture<AddCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AddCategoryComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();

    fixture = TestBed.createComponent(AddCategoryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categoryType', CategoryTypes.AUFENTHALTSTITEL);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
