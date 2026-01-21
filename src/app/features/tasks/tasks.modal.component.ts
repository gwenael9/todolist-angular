import { Component, inject, model } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '@core/tasks/services/task.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../core/auth/services/auth.service';
import { UserService } from '../../core/users/services/user.service';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './tasks.modal.component.html',
})
export class TaskCreateComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  visible = model<boolean>(false);

  currentUserIsAdmin = this.authService.currentUser$()?.role === 'ADMIN';

  users = this.userService.users;

  constructor() {
    if (this.currentUserIsAdmin) this.userService.list();
  }

  taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    targetUserId: [undefined as number | undefined],
  });

  close() {
    this.visible.set(false);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const { title, description, targetUserId } = this.taskForm.value;
      if (!title) return;
      this.taskService
        .create({
          title,
          description,
          targetUserId,
        })
        .subscribe({
          next: () => {
            this.close();
            this.taskForm.reset();
          },
        });
    }
  }
}
