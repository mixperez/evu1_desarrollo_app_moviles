
import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import { beforeEach, describe, expect, it } from 'vitest';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should start with an empty task list', () => {
    expect(service.tasks()).toEqual([]);
  });

  it('should add a task with a unique id', () => {
    service.addTask('Buy bread', 'Stop by the bakery');

    const [task] = service.tasks();

    expect(service.tasks()).toHaveLength(1);
    expect(task.title).toBe('Buy bread');
    expect(task.description).toBe('Stop by the bakery');
    expect(task.id).toBeTruthy();
  });

  it('should generate a unique id for each task', () => {
    service.addTask('Task one', 'Description one');
    service.addTask('Task two', 'Description two');

    const [first, second] = service.tasks();

    expect(first.id).not.toBe(second.id);
  });

  it('should update only the selected task', () => {
    service.addTask('Task one', 'Description one');
    service.addTask('Task two', 'Description two');

    const target = service.tasks()[1];
    service.updateTask(target.id, 'Updated task', 'New description');

    expect(service.tasks()[1]).toEqual({
      id: target.id,
      title: 'Updated task',
      description: 'New description',
    });
    expect(service.tasks()[0].title).toBe('Task two');
  });

  it('should delete only the selected task', () => {
    service.addTask('Task one', 'Description one');
    service.addTask('Task two', 'Description two');

    const target = service.tasks()[0];
    service.deleteTask(target.id);

    expect(service.tasks()).toHaveLength(1);
    expect(service.tasks()[0].title).toBe('Task one');
  });
});
