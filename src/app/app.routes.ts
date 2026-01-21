import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/guards/admin.guards';
import { authGuard } from './core/auth/guards/auth.guard';
import { AdminComponent } from './features/admin/admin';
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
    path: 'users',
    component: AdminComponent,
    canActivate: [adminGuard],
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
