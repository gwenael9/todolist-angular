import { Component, model } from '@angular/core';
import { Task } from '@core/tasks/interfaces/task';
import { CardModule } from 'primeng/card';
import { CardDashboardPipe } from '../pipe/card.pipe';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CardModule, CardDashboardPipe],
  template: `
    @let config = value() | status;
    <p-card>
      <div class="flex justify-between items-center">
        <div>
          <span class="block text-500 font-medium mb-3">{{ config.title }}</span>
          <div class="text-900 font-bold text-3xl">{{ tasks().length }}</div>
        </div>
        <div
          class="flex items-center justify-center rounded-md w-12 h-12"
          [class.bg-blue-200]="config.color === 'blue'"
          [class.bg-green-200]="config.color === 'green'"
          [class.bg-purple-200]="config.color === 'purple'"
        >
          <i
            class="pi text-xl"
            [class]="config.iconName"
            [class.text-blue-500]="config.color === 'blue'"
            [class.text-green-500]="config.color === 'green'"
            [class.text-purple-500]="config.color === 'purple'"
          ></i>
        </div>
      </div>
    </p-card>
  `,
})
export class CardComponent {
  tasks = model<Task[]>([]);
  value = model<'ALL' | 'DONE' | 'MINE'>('ALL');
}
