
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TaskService } from '../services/task.service';

import { HomePage } from './home.page';

type AlertElement = Awaited<ReturnType<AlertController['create']>>;

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let taskService: TaskService;
  let alertController: AlertController;

  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    alertController = TestBed.inject(AlertController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should report an invalid field only after it is touched', () => {
    expect(component.isFieldInvalid('title')).toBe(false);

    component.taskForm.controls.title.markAsTouched();
    expect(component.isFieldInvalid('title')).toBe(true);

    component.taskForm.controls.title.setValue('Valid title');
    expect(component.isFieldInvalid('title')).toBe(false);
  });

  it('should not add a task when the form is empty', () => {
    component.saveTask();

    expect(component.tasks()).toHaveLength(0);
    expect(component.taskForm.controls.title.touched).toBe(true);
    expect(component.taskForm.controls.description.touched).toBe(true);
  });

  it('should not add a task when fields contain only spaces', () => {
    component.taskForm.setValue({ title: '   ', description: '   ' });

    expect(component.taskForm.invalid).toBe(true);
    component.saveTask();

    expect(component.tasks()).toHaveLength(0);
    expect(component.taskForm.controls.title.touched).toBe(true);
    expect(component.taskForm.controls.description.touched).toBe(true);
  });

  it('should show a quiet status message after adding a task', () => {
    vi.useFakeTimers();
    component.taskForm.setValue({ title: 'Task', description: 'Description' });

    component.saveTask();

    expect(component.statusMessage()).toBe('Tarea agregada');

    vi.advanceTimersByTime(2200);

    expect(component.statusMessage()).toBeNull();
  });

  it('should add a task with trimmed values and reset the form', () => {
    component.taskForm.setValue({
      title: '  Study Ionic  ',
      description: '  Review components and forms  ',
    });

    component.saveTask();

    expect(component.tasks()).toHaveLength(1);
    expect(component.tasks()[0]).toMatchObject({
      title: 'Study Ionic',
      description: 'Review components and forms',
    });
    expect(component.taskForm.getRawValue()).toEqual({
      title: '',
      description: '',
    });
  });

  it('should load a task for editing and save the changes', () => {
    taskService.addTask('Original title', 'Original description');
    const task = component.tasks()[0];

    component.startEdit(task);

    expect(component.editingTaskId()).toBe(task.id);
    expect(component.taskForm.getRawValue()).toEqual({
      title: 'Original title',
      description: 'Original description',
    });

    component.taskForm.setValue({
      title: 'Edited title',
      description: 'Edited description',
    });
    component.saveTask();

    expect(component.tasks()[0]).toMatchObject({
      id: task.id,
      title: 'Edited title',
      description: 'Edited description',
    });
    expect(component.editingTaskId()).toBeNull();
  });

  it('should delete the selected task after confirmation', async () => {
    taskService.addTask('Task one', 'Description one');
    const task = component.tasks()[0];
    const present = vi.fn().mockResolvedValue(undefined);
    const alert = { present } as unknown as AlertElement;
    const createSpy = vi.spyOn(alertController, 'create').mockResolvedValue(alert);

    await component.confirmDelete(task);

    const options = createSpy.mock.calls[0]?.[0];

    if (!options) {
      throw new Error('Alert options were not captured');
    }

    const buttons = (options.buttons ?? []) as { role?: string; handler?: () => void }[];
    const confirmButton = buttons.find((button) => button.role === 'destructive');

    expect(present).toHaveBeenCalled();
    expect(options.message).toContain('Task one');

    confirmButton?.handler?.();

    expect(component.tasks()).toHaveLength(0);
  });

  it('should cancel editing and clear the form', () => {
    taskService.addTask('Original title', 'Original description');
    const task = component.tasks()[0];

    component.startEdit(task);
    component.cancelEdit();

    expect(component.editingTaskId()).toBeNull();
    expect(component.taskForm.getRawValue()).toEqual({
      title: '',
      description: '',
    });
    expect(component.tasks()).toHaveLength(1);
  });
});
