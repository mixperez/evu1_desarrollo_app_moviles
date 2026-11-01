import { Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AlertController,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline,
  checkmarkCircleOutline,
  clipboardOutline,
  closeOutline,
  createOutline,
  leafOutline,
  trashOutline,
} from 'ionicons/icons';

import type { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBadge,
    IonContent,
    IonCard,
    IonCardContent,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
  ],
})

//Página principal y gestión de tareas.
export class HomePage {
  private readonly taskService = inject(TaskService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly alertController = inject(AlertController);
  private readonly destroyRef = inject(DestroyRef);
  private readonly content = viewChild(IonContent);

  readonly tasks = this.taskService.tasks;
  readonly editingTaskId = signal<string | null>(null);

  //Mesaje de estado de creación de la tarea.
  readonly statusMessage = signal<string | null>(null);

  private statusTimer?: ReturnType<typeof setTimeout>;

  readonly taskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.pattern(/\S/)]],
    description: ['', [Validators.required, Validators.pattern(/\S/)]],
  });

  constructor() {
    addIcons({
      addOutline,
      checkmarkCircleOutline,
      clipboardOutline,
      closeOutline,
      createOutline,
      leafOutline,
      trashOutline,
    });

    this.destroyRef.onDestroy(() => {
      if (this.statusTimer) {
        clearTimeout(this.statusTimer);
      }
    });
  }

  //Verificación de campos en el formulario.
  isFieldInvalid(field: 'title' | 'description'): boolean {
    const control = this.taskForm.controls[field];
    return control.invalid && control.touched;
  }

  //Guardar tarea.
  saveTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const { title, description } = this.taskForm.getRawValue();
    const editingId = this.editingTaskId();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (editingId) {
      this.taskService.updateTask(editingId, trimmedTitle, trimmedDescription);
    } else {
      this.taskService.addTask(trimmedTitle, trimmedDescription);
    }

    this.showStatus(editingId ? 'Tarea actualizada' : 'Tarea agregada');
    this.resetForm();
  }

  startEdit(task: Task): void {
    this.editingTaskId.set(task.id);
    this.taskForm.setValue({
      title: task.title,
      description: task.description,
    });
    void this.content()?.scrollToTop(300);
  }

  //Cancelar edición.
  cancelEdit(): void {
    this.resetForm();
  }

  //Eliminación de tarea.
  async confirmDelete(task: Task): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar tarea',
      message: `¿Seguro que quieres eliminar "${task.title}"? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.taskService.deleteTask(task.id);

            if (this.editingTaskId() === task.id) {
              this.resetForm();
            }

            this.showStatus('Tarea eliminada');
          },
        },
      ],
    });

    await alert.present();
  }

  //Reestablece formulario.
  private resetForm(): void {
    this.taskForm.reset();
    this.editingTaskId.set(null);
  }

  //Limpia mensajes.
  private showStatus(message: string): void {
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
    }

    this.statusMessage.set(message);
    this.statusTimer = setTimeout(() => {
      this.statusMessage.set(null);
      this.statusTimer = undefined;
    }, 2200);
  }
}
