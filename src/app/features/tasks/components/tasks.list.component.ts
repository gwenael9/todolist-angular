import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '@core/tasks/interfaces/task';
import { TaskService } from '@core/tasks/services/task.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TaskStatusPipe } from '../pipes/task.pipe';
import { TaskCreateComponent } from './tasks.modal.component';

type TaskFilter = 'ALL' | 'TODO' | 'DONE';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [TaskCreateComponent, ButtonModule, TagModule, TaskStatusPipe, DatePipe],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Mes Tâches</h1>
      <p-button label="Nouvelle tâche" icon="pi pi-plus" (onClick)="openCreate()" />
    </div>

    <!-- Barre de filtres -->
    <div class="flex gap-2 mb-4">
      <p-button
        label="Toutes"
        [severity]="filter() === 'ALL' ? 'success' : 'secondary'"
        (onClick)="filter.set('ALL')"
      ></p-button>
      <p-button
        label="À faire"
        [severity]="filter() === 'TODO' ? 'success' : 'secondary'"
        (onClick)="filter.set('TODO')"
      ></p-button>
      <p-button
        label="Terminées"
        [severity]="filter() === 'DONE' ? 'success' : 'secondary'"
        (onClick)="filter.set('DONE')"
      ></p-button>
    </div>

    <div class="flex justify-center flex-col sm:flex-row sm:flex-wrap gap-4">
      @for (task of filteredTasks(); track task.id) {
        <div
          (click)="openDetail(task.id)"
          class="border p-4 rounded-md dark:border-gray-600 dark:bg-black/20 min-w-80 shadow-sm hover:cursor-pointer"
        >
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
                  (onClick)="$event.stopPropagation(); modifyStatus(task)"
                  text
                  [icon]="task.status === 'PENDING' ? 'pi pi-play-circle' : 'pi pi-check-circle'"
                />
              }
              <p-button
                (onClick)="$event.stopPropagation(); openEdit(task.id)"
                text
                icon="pi pi-pencil"
              />
              <p-button
                (onClick)="$event.stopPropagation(); deleteTask(task.id)"
                text
                icon="pi pi-trash"
              />
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
  private router = inject(Router);

  openDetail(taskId: number) {
    this.router.navigate(['/tasks', taskId]);
  }
  tasks = this.taskService.tasks;

  // Modale de création / édition
  showModal = signal(false);
  selectedTaskId = signal<number | null>(null);

  // Filtres dynamiques

  filter = signal<TaskFilter>('ALL');

  filteredTasks = computed(() => {
    const tasks = this.tasks();
    const filter = this.filter();

    if (filter === 'ALL') return tasks;
    if (filter === 'TODO') return tasks.filter((t) => t.status !== 'DONE');
    return tasks.filter((t) => t.status === 'DONE');
  });

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
    if (task.status === 'PENDING') newStatus = 'IN_PROGRESS';
    else if (task.status === 'IN_PROGRESS') newStatus = 'DONE';

    if (newStatus) {
      this.taskService.updateTask(task.id, { status: newStatus }).subscribe();
    }
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe();
  }
}
