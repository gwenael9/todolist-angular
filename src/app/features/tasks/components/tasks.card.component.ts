import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Task } from '@core/tasks/interfaces/task';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TaskStatusPipe } from '../pipes/task.pipe';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [ButtonModule, TagModule, TaskStatusPipe, DatePipe],
  template: `
    <div
      (click)="viewDetail.emit(task().id)"
      class="border p-4 rounded-md dark:border-gray-600 w-80 shadow-sm hover:cursor-pointer"
      style="background-color: var(--p-content-background)"
    >
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold" [class.line-through]="task().status === 'DONE'">
          {{ task().title }}
        </h2>
        <p-tag
          [value]="(task().status | status).label"
          [severity]="(task().status | status).severity"
          rounded
          class="text-xs opacity-60"
        />
      </div>

      <span class="text-xs italic opacity-60 mt-2">Description</span>
      <p class="p-2 border rounded-md dark:border-gray-600 text-xs overflow-hidden truncate">
        {{ task().description || '...' }}
      </p>

      <div class="flex justify-between items-center">
        <p class="text-xs opacity-60">Assignée à : {{ task().user.username }}</p>
        <div (click)="$event.stopPropagation()">
          @if (task().status !== 'DONE') {
            <p-button
              (onClick)="changeStatus.emit(task())"
              text
              [icon]="task().status === 'PENDING' ? 'pi pi-play-circle' : 'pi pi-check-circle'"
            />
          }
          <p-button (onClick)="edit.emit(task().id)" text icon="pi pi-pencil" />
          <p-button (onClick)="delete.emit(task().id)" text icon="pi pi-trash" />
        </div>
      </div>

      <div class="text-xs opacity-40 flex flex-col">
        <span>Créée le : {{ task().createdAt | date: 'dd/MM/yyyy HH:mm' }}</span>
        <span>Modifiée le : {{ task().updatedAt | date: 'dd/MM/yyyy HH:mm' }}</span>
      </div>
    </div>
  `,
})
export class TaskCardComponent {
  task = input.required<Task>();

  viewDetail = output<number>();
  edit = output<number>();
  delete = output<number>();
  changeStatus = output<Task>();
}
