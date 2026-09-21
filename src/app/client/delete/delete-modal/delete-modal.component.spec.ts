import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModalComponent } from './delete-modal.component';

import {defaultTestProviders} from '../../../../testing/test-providers';

describe('DeleteModalComponent', () => {
  let component: DeleteModalComponent;
  let fixture: ComponentFixture<DeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DeleteModalComponent],
      providers: [...defaultTestProviders()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
