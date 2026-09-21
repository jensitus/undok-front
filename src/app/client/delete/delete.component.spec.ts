import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteComponent } from './delete.component';

import {defaultTestProviders} from '../../../testing/test-providers';

describe('DeleteComponent', () => {
  let component: DeleteComponent;
  let fixture: ComponentFixture<DeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DeleteComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
