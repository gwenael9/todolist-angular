import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true,
})
export class TaskStatusPipe implements PipeTransform {
  transform(value: 'PENDING' | 'IN_PROGRESS' | 'DONE' | undefined): {
    label: string;
    severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined;
  } {
    switch (value) {
      case 'PENDING':
        return { label: 'En attente', severity: 'warn' };
      case 'IN_PROGRESS':
        return { label: 'En cours', severity: 'info' };
      case 'DONE':
        return { label: 'Terminée', severity: 'success' };
      default:
        return { label: '', severity: undefined };
    }
  }
}
