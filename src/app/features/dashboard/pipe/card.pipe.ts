import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true,
})
export class CardDashboardPipe implements PipeTransform {
  transform(value: 'ALL' | 'DONE' | 'MINE'): {
    title: string;
    iconName: string;
    color: string;
  } {
    switch (value) {
      case 'ALL':
        return { title: 'Total', iconName: 'pi-list', color: 'blue' };
      case 'DONE':
        return { title: 'Terminées', iconName: 'pi-check-circle', color: 'green' };
      case 'MINE':
        return { title: 'Mes tâches', iconName: 'pi-user', color: 'purple' };
      default:
        return { title: 'Default', iconName: 'pi-list', color: 'blue' };
    }
  }
}
