import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '@core/tasks/interfaces/task';
import { TaskService } from '@core/tasks/services/task.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TaskStatusPipe } from '../pipes/task.pipe';
import { CommentsListComponent } from './comments.list.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [ButtonModule, TagModule, TaskStatusPipe, DatePipe, CommentsListComponent],
  template: `
    <div class="mb-6">
      <p-button label="Retour" icon="pi pi-arrow-left" text (onClick)="goBack()" />
    </div>

    @if (task()) {
      <div
        class="border p-6 rounded-md dark:border-gray-600 dark:bg-black/20 max-w-3xl mx-auto shadow-md"
      >
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-3xl font-bold">
            {{ task()?.title }}
          </h1>

          <p-tag
            [value]="(task()?.status | status).label"
            [severity]="(task()?.status | status).severity"
            rounded
          />
        </div>

        <p
          class="text-lg mb-6 line-clamp-5 overflow-hidden wrap-break-word whitespace-pre-wrap block"
        >
          {{ task()?.description }}
        </p>

        <div class="flex justify-between items-center mb-6">
          <p class="text-sm opacity-70">
            Assignée à : <strong>{{ task()?.user?.username }}</strong>
          </p>
        </div>

        <div class="text-xs opacity-50 flex flex-col gap-1">
          <span>Créée le : {{ task()?.createdAt | date: 'dd/MM/yyyy HH:mm' }}</span>
          <span>Modifiée le : {{ task()?.updatedAt | date: 'dd/MM/yyyy HH:mm' }}</span>
        </div>
      </div>

      <app-comments-list />
    } @else {
      <p class="text-center py-10">Chargement de la tâche...</p>
    }
  `,
})
export class TaskDetailComponent {
  id = input.required<number>();

  private taskService = inject(TaskService);
  private router = inject(Router);

  task = signal<Task | null>(null);

  loadTaskEffect = effect(() => {
    const taskId = this.id();

    this.taskService.getTaskById(taskId).subscribe((task) => {
      this.task.set(task);
    });
  });

  goBack() {
    this.router.navigate(['/tasks']);
  }
}
