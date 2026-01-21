import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@core/auth/services/auth.service';
import { TaskService } from '@core/tasks/services/task.service';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { CardComponent } from './card.component';

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, CardComponent, ProgressBarModule, ToastModule],
  template: ` <div class="p-6">
    <h2 class="text-3xl font-bold mb-6 text-primary">Tableau de bord</h2>
    <div class="max-w-250 m-auto">
      <span class="italic text-xs opacity-60">Progression globale des tâches</span>
      <p-progress-bar [value]="progressValue()" />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        @if (currentUser()?.role === 'ADMIN') {
          <app-card [tasks]="tasks()" value="ALL"></app-card>
        }
        <app-card [tasks]="tasksDone()" value="DONE"></app-card>
        <app-card [tasks]="tasksForMe()" value="MINE"></app-card>
      </div>
    </div>
  </div>`,
})
export class DashboardComponent {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser$;

  tasks = this.taskService.tasks;
  tasksDone = this.taskService.tasksDone;

  tasksForMe = computed(() => {
    const user = this.currentUser();
    const allTasks = this.tasks();

    if (!user) return [];
    return allTasks.filter((t) => t.user?.id === user.id);
  });

  progressValue = computed(() => {
    const allTasks = this.tasks();
    if (allTasks.length === 0) return 0;
    const n = (this.tasksDone().length / allTasks.length) * 100;
    return n.toPrecision(3);
  });

  ngOnInit() {
    this.taskService.list();
  }
}
