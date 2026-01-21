import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  template: `
    <div class="flex flex-col items-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        Bienvenue sur TaskManager
      </h1>

      <p class="text-lg text-gray-600 dark:text-gray-400 mb-10 text-center max-w-md">
        Gérez vos projets, suivez vos progrès et collaborez avec votre équipe en toute simplicité.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        @if (currentUser()) {
          <p-button
            label="Dashboard"
            icon="pi pi-chart-bar"
            [outlined]="true"
            routerLink="/dashboard"
            styleClass="w-full sm:w-auto"
            severity="secondary"
          >
          </p-button>

          <p-button
            label="Mes Tâches"
            icon="pi pi-check-square"
            routerLink="/tasks"
            styleClass="w-full sm:w-auto"
            severity="primary"
          >
          </p-button>
        } @else {
          <p-button
            label="Se connecter"
            icon="pi pi-sign-in"
            routerLink="/auth"
            styleClass="w-full sm:w-auto"
            severity="primary"
          >
          </p-button>
        }
      </div>

      <div class="mt-12 text-gray-400 text-sm italic">"L'organisation est la clé du succès."</div>
    </div>
  `,
})
export class HomeComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser$;
}
