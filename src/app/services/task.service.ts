import { Injectable, signal } from '@angular/core';

import type { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
//Servicio que gestiona las tareas y las guarda en memoria.
export class TaskService {
  private readonly tasksState = signal<Task[]>([]);
  private nextId = 1;

  readonly tasks = this.tasksState.asReadonly();

  //Agregar nueva tarea
  addTask(title: string, description: string): void {
    const task: Task = { id: `${Date.now()}-${this.nextId++}`, title, description };

    this.tasksState.update((tasks) => [task, ...tasks]);
  }

  //Actualiza una tarea
  updateTask(id: string, title: string, description: string): void {
    this.tasksState.update((tasks) => tasks.map((task) => (task.id === id ? { ...task, title, description } : task)));
  }

  //Elimina una tarea
  deleteTask(id: string): void {
    this.tasksState.update((tasks) => tasks.filter((task) => task.id !== id));
  }
}
