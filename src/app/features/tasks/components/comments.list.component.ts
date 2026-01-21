import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/auth/services/auth.service';
import { ButtonModule } from 'primeng/button';

export interface Comment {
  author: string;
  message: string;
  createdAt: Date;
}

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DatePipe],
  template: `
    <div class="mt-10 border-t pt-6">
      <h2 class="text-xl font-semibold mb-4">Commentaires</h2>

      @if (comments().length > 0) {
        <div class="flex flex-col gap-4 mb-6">
          @for (comment of comments(); track $index) {
            <div class="border p-3 rounded-md dark:border-gray-600 dark:bg-black/20">
              <div class="flex justify-between items-center mb-1">
                <strong>{{ comment.author }}</strong>
                <span class="text-xs opacity-60">
                  {{ comment.createdAt | date:'dd/MM/yyyy HH:mm' }}
                </span>
              </div>
              <p>{{ comment.message }}</p>
            </div>
          }
        </div>
      } @else {
        <p class="text-sm opacity-60 mb-6">Aucun commentaire pour le moment.</p>
      }

      <form [formGroup]="form" (ngSubmit)="submit()">
        <textarea
          formControlName="message"
          rows="3"
          class="w-full p-2 border rounded-md mb-2 dark:bg-black/20"
          placeholder="Ajouter un commentaire..."
        ></textarea>

        <p-button
          type="submit"
          label="Envoyer"
          [disabled]="form.invalid"
        />
      </form>
    </div>
  `,
})

export class CommentsListComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);


  currentUser = this.authService.currentUser$;

  comments = signal<Comment[]>([]);

  form = this.fb.nonNullable.group({
    message: ['', Validators.required],
  });

  submit() {
    const current = this.currentUser(); 
    const formValue = this.form.getRawValue();
    
    if (!current) return;

    const newComment: Comment = {
      author: current.username, 
      message: formValue.message,
      createdAt: new Date(),
    };

    this.comments.update(list => [...list, newComment]);
    this.form.reset();
  }
}