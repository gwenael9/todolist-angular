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
  template: `
    <p-dialog
      header="Nouvelle Tâche"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '25rem' }"
    >
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-1">
          <label for="title" class="font-semibold">Titre</label>
          <input
            pInputText
            id="title"
            formControlName="title"
            class="flex-auto"
            autocomplete="off"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="description" class="font-semibold">Description</label>
          <input
            pInputText
            id="description"
            formControlName="description"
            class="flex-auto"
            autocomplete="off"
          />
        </div>

        @if (currentUserIsAdmin) {
          <div class="flex flex-col gap-1">
            <label for="targetUserId" class="font-semibold">Attribuer à l'utilisateur</label>
            <select id="targetUserId" formControlName="targetUserId" class="p-inputtext flex-auto">
              <option value="">Sélectionner un utilisateur</option>
              @for (user of users(); track user.id) {
                <option [value]="user.id">{{ user.username }}</option>
              } @empty {
                <span>Aucun utilisateur de disponible</span>
              }
            </select>
          </div>
        }

        <div class="flex justify-end gap-2 mt-4">
          <p-button label="Annuler" severity="secondary" (onClick)="close()" />
          <p-button label="Enregistrer" type="submit" [disabled]="taskForm.invalid" />
        </div>
      </form>
    </p-dialog>
  `,
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

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    targetUserId: [undefined as number | undefined],
  });

  close() {
    this.visible.set(false);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.getRawValue();
      this.taskService
        .create({
          title: formValue.title ?? '',
          description: formValue.description ?? '',
          targetUserId: formValue.targetUserId ?? undefined,
        })
        .subscribe({
          next: () => {
            this.close();
          },
        });
    }
  }
}
