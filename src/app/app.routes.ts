import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { adminGuard } from './core/auth/guards/admin.guards';
import { AuthFormComponent } from './features/auth/form.component';
import { HomeComponent } from './features/home/home.component';
import { TasksListComponent } from './features/tasks/components/tasks.list.component';
import { AdminComponent } from './features/admin/admin';

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

];
