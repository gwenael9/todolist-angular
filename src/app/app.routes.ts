import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { AuthFormComponent } from './features/auth/form.component';
import { DashboardComponent } from './features/dashboard/components/dashboard.component';
import { HomeComponent } from './features/home/home.component';
import { TaskDetailComponent } from './features/tasks/components/tasks.detail.component';
import { TasksListComponent } from './features/tasks/components/tasks.list.component';

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
    canActivate: [authGuard],
  },
  {
    path: 'tasks/:id',
    component: TaskDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];
