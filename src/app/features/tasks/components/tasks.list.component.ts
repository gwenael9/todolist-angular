import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '@core/tasks/interfaces/task';
import { TaskService } from '@core/tasks/services/task.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TaskStatusPipe } from '../pipes/task.pipe';
import { TaskCreateComponent } from './tasks.modal.component';



@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [TaskCreateComponent, ButtonModule, TagModule, TaskStatusPipe, DatePipe],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Mes Tâches</h1>
      <p-button label="Nouvelle tâche" icon="pi pi-plus" (onClick)="openCreate()" />
    </div>

    <div class="flex justify-center flex-col sm:flex-row sm:flex-wrap gap-4">
      @for (task of tasks(); track task.id) {
      <div (click)="openDetail(task.id)" class="border p-4 rounded-md dark:border-gray-600 dark:bg-black/20 min-w-80 shadow-sm">
        <p>popopopo</p>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold" [class.line-through]="task.status === 'DONE'">
              {{ task.title }}
            </h2>
            <p-tag
              [value]="(task.status | status).label"
              [severity]="(task.status | status).severity"
              rounded
              class="text-xs opacity-60"
            />
          </div>

          <p class="p-2 min-h-12">{{ task.description }}</p>
          <div class="flex justify-between items-center">
            <p class="text-xs opacity-60">Assignée à : {{ task.user.username }}</p>
            <div>
              @if (task.status !== 'DONE') {
                <p-button
                  (onClick)="modifyStatus(task)"
                  text
                  [icon]="task.status === 'PENDING' ? 'pi pi-play-circle' : 'pi pi-check-circle'"
                />
              }
              <p-button (onClick)="openEdit(task.id)" text icon="pi pi-pencil" />
              <p-button (onClick)="deleteTask(task.id)" text icon="pi pi-trash" />
            </div>
          </div>
          <div class="text-xs opacity-40 flex flex-col">
            <span>Créée le : {{ task.createdAt | date: 'dd/MM/yyyy HH:mm' }}</span>
            <span>Modifiée le : {{ task.updatedAt | date: 'dd/MM/yyyy HH:mm' }}</span>
          </div>
        </div>
      } @empty {
        <p class="text-center w-full py-10">Aucune tâche disponible.</p>
      }
    </div>

    <app-task-create [(visible)]="showModal" [(taskId)]="selectedTaskId" />
  `,
})
export class TasksListComponent {
  private taskService = inject(TaskService);
  private router = inject(Router)

  
openDetail(taskId: number) {
  this.router.navigate(['/tasks', taskId]);
}
  tasks = this.taskService.tasks;

  showModal = signal(false);
  selectedTaskId = signal<number | null>(null);

  ngOnInit() {
    this.taskService.list();
  }

  openEdit(taskId: number) {
    this.selectedTaskId.set(taskId);
    this.showModal.set(true);
  }

  openCreate() {
    this.selectedTaskId.set(null);
    this.showModal.set(true);
  }

  modifyStatus(task: Task) {
    let newStatus: 'IN_PROGRESS' | 'DONE' | undefined;
    if (task.status === 'PENDING') {
      newStatus = 'IN_PROGRESS';
    } else if (task.status === 'IN_PROGRESS') {
      newStatus = 'DONE';
    }

    if (newStatus) {
      this.taskService.updateTask(task.id, { status: newStatus }).subscribe();
    }
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe();
  }
}
