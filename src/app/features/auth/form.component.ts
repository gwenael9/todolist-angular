import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
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
  ],
  template: `
    <div class="border flex flex-col p-6 rounded-md max-w-md mx-auto">
      <div>
        <h2 class="text-xl">{{ isLogin() ? 'Connexion' : 'Créer son compte' }}</h2>
        <p class="text-gray-500 text-sm italic">Veuillez renseigner vos informations.</p>
      </div>

      @if (errorMessage()) {
        <div class="mt-3 mb-4">
          <p-message size="small" severity="error">{{ errorMessage() }}</p-message>
        </div>
      }
      <form [formGroup]="authForm" class="mt-4" (ngSubmit)="onSubmit()">
        <div class="flex flex-col gap-6 mb-8">
          <div class="flex flex-col gap-1">
            <p-float-label variant="on">
              <p-iconfield>
                <input
                  pInputText
                  id="username"
                  formControlName="username"
                  autocomplete="off"
                  class="w-full"
                />
                <label for="username">Nom d'utilisateur</label>
              </p-iconfield>
            </p-float-label>
          </div>

          <div class="flex flex-col gap-1">
            <p-float-label variant="on">
              <p-iconfield>
                <input
                  type="password"
                  pInputText
                  id="password"
                  formControlName="password"
                  autocomplete="off"
                  class="w-full"
                />
                <label for="password">Mot de passe</label>
              </p-iconfield>
            </p-float-label>
          </div>

          @if (!isLogin()) {
            <div class="flex flex-col gap-1">
              <p-float-label variant="on">
                <p-iconfield>
                  <input
                    type="password"
                    pInputText
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    autocomplete="off"
                    class="w-full"
                  />
                  <label for="confirmPassword">Confirmer le mot de passe</label>
                </p-iconfield>
              </p-float-label>
            </div>
          }
        </div>

        <div class="flex justify-between items-center gap-2">
          <p class="text-sm italic">
            {{ isLogin() ? 'Pas de compte ?' : 'Déjà un compte ?' }}
            <span role="button" tabindex="0" (click)="swipeForm()" class="underline cursor-pointer">
              {{ isLogin() ? "S'inscrire" : 'Se connecter' }}.
            </span>
          </p>
          <p-button
            type="submit"
            severity="success"
            label="Confirmer"
            [loading]="loading()"
            [disabled]="authForm.invalid"
          ></p-button>
        </div>
      </form>
    </div>
  `,
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
    if (this.isLogin()) this.router.navigate(['']);
    else this.swipeForm();
  }

  private handleError(err: any) {
    this.errorMessage.set(err?.error.message || 'Erreur lors de la requête');
    this.loading.set(false);
    this.authForm.get('password')?.reset();
    this.authForm.get('confirmPassword')?.reset();
  }
}
