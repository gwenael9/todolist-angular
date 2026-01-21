import { Component, inject, model } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/auth/services/auth.service';
import { TaskService } from '@core/tasks/services/task.service';
import { UserService } from '@core/users/services/user.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule, SelectModule],
  templateUrl: './tasks.modal.component.html',
})
export class TaskCreateComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  visible = model<boolean>(false);
  taskId = model<number | null>(null);

  currentUserIsAdmin = this.authService.currentUser$()?.role === 'ADMIN';
  users = this.userService.users;

  ngOnInit() {
    if (this.currentUserIsAdmin) this.userService.list();
  }

  onDialogOpen() {
    const id = this.taskId();
    if (id) {
      this.taskService.getTaskById(id).subscribe((task) => {
        this.taskForm.patchValue({
          ...task,
          targetUserId: task.user?.id,
        });
      });
    } else {
      this.taskForm.reset();
    }
  }

  taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    targetUserId: [undefined as number | undefined],
  });

  close() {
    this.visible.set(false);
    this.taskId.set(null);
    this.taskForm.reset();
  }

  onSubmit() {
    if (this.taskForm.invalid) return;

    const data = this.taskForm.getRawValue();
    const id = this.taskId();

    const request$ = id ? this.taskService.updateTask(id, data) : this.taskService.create(data);

    request$.subscribe({
      next: () => this.close(),
    });
  }
}
