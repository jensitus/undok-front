import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectBoxComponent } from './multi-select-box.component';

import {defaultTestProviders} from '../../../../testing/test-providers';

import {CategoryTypes} from '../../model/category-types';
describe('MultiSelectBoxComponent', () => {
  let component: MultiSelectBoxComponent;
  let fixture: ComponentFixture<MultiSelectBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MultiSelectBoxComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();

    fixture = TestBed.createComponent(MultiSelectBoxComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categoryType', CategoryTypes.COUNSELING_LANGUAGE);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
