import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-auth-form',
  imports: [
    FloatLabelModule,
    IconFieldModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    MessageModule,
    IconField,
    InputIcon,
  ],
  templateUrl: './form.component.html',
})
export class AuthFormComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  isLogin = signal(true);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  authForm: FormGroup = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: [''],
  });

  onSubmit() {
    this.errorMessage.set(null);
    if (this.authForm.invalid) return;
    this.loading.set(true);

    const { username, password, confirmPassword } = this.authForm.value;

    if (this.isLogin()) {
      this.authService.login({ username, password }).subscribe({
        next: () => this.handleSuccess(),
        error: (err: Error) => this.handleError(err),
      });
    } else {
      if (password !== confirmPassword) {
        this.loading.set(false);
        this.errorMessage.set('Les mots de passe ne correspondent pas');
        return;
      }
      this.authService.register({ username, password }).subscribe({
        next: () => this.handleSuccess(),
        error: (err: Error) => this.handleError(err),
      });
    }
  }

  clearForm() {
    this.authForm.reset();
    this.errorMessage.set(null);
  }

  swipeForm() {
    this.clearForm();
    this.isLogin.set(!this.isLogin());
    if (this.isLogin()) {
      this.authForm.get('username')?.clearValidators();
      this.authForm.get('confirmPassword')?.clearValidators();
    } else {
      this.authForm.get('username')?.setValidators([Validators.required]);
      this.authForm
        .get('confirmPassword')
        ?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.authForm.get('username')?.updateValueAndValidity();
    this.authForm.get('confirmPassword')?.updateValueAndValidity();
  }

  private handleSuccess() {
    this.loading.set(false);
    this.clearForm();
    if (this.isLogin()) this.router.navigate(['tasks']);
    else this.swipeForm();
  }

  private handleError(err: any) {
    this.errorMessage.set(err?.error.message || 'Erreur lors de la requête');
    this.loading.set(false);
    this.authForm.get('password')?.reset();
    this.authForm.get('confirmPassword')?.reset();
  }
}
