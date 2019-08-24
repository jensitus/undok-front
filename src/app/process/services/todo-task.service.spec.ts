import { TestBed } from '@angular/core/testing';

import { TodoTaskService } from './todo-task.service';

describe('TodoTaskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TodoTaskService = TestBed.get(TodoTaskService);
    expect(service).toBeTruthy();
  });
});
