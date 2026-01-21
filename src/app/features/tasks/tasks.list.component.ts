import { Component, inject, signal } from '@angular/core';
import { TaskService } from '@core/tasks/services/task.service';
import { ButtonModule } from 'primeng/button';
import { TaskCreateComponent } from './task.modal.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [TaskCreateComponent, ButtonModule],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Mes Tâches</h1>
      <p-button label="Nouvelle tâche" icon="pi pi-plus" (onClick)="showModal.set(true)" />
    </div>

    <div class="flex flex-col sm:flex-row sm:flex-wrap gap-4">
      @for (task of tasks(); track task.id) {
        <div class="border p-4 rounded-md dark:border-gray-600 min-w-50 shadow-sm">
          <h2 class="text-xl font-medium">{{ task.title }}</h2>
          <p class="text-xs text-right opacity-60 mt-2">{{ task.status }}</p>
        </div>
      } @empty {
        <p class="text-center w-full py-10">Aucune tâche disponible.</p>
      }
    </div>

    <app-task-create [(visible)]="showModal" />
  `,
})
export class TasksListComponent {
  private taskService = inject(TaskService);
  tasks = this.taskService.tasks;

  showModal = signal(false);

  constructor() {
    this.taskService.list();
  }
}
