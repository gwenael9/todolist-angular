import { Routes } from '@angular/router';
import { AuthFormComponent } from './features/auth/form.component';
import { HomeComponent } from './features/home/home.component';
import { TasksListComponent } from './features/tasks/tasks.list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth',
    component: AuthFormComponent,
  },
  {
    path: 'tasks',
    component: TasksListComponent,
  },
];
