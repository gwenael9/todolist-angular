import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { capitalizeFirstLetter } from '../utils';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonModule, MenuModule, AvatarModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser$;
  isDarkMode: boolean = false;

  toggleDarkMode() {
    const element = document.querySelector('html');
    const isDark = element?.classList.toggle('my-app-dark');
    this.isDarkMode = !!isDark;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.toggleDarkMode();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  items = computed<MenuItem[]>(() => {
    const isAdmin = this.currentUser()?.role === 'ADMIN';
    return [
      { separator: true },
      { label: 'Accueil', icon: PrimeIcons.HOME, routerLink: '/' },
      ...(isAdmin
        ? [{ label: 'Administration', icon: PrimeIcons.SHIELD, routerLink: '/users' }]
        : []),
      { label: 'Dashboard', icon: PrimeIcons.OBJECTS_COLUMN, routerLink: '/dashboard' },
      { label: 'Mes tâches', icon: PrimeIcons.LIST_CHECK, routerLink: '/tasks' },
      { separator: true },
      {
        label: 'Déconnexion',
        icon: PrimeIcons.SIGN_OUT,
        command: () => this.logout(),
        iconClass: '!text-red-500',
        labelClass: '!text-red-500',
      },
    ];
  });

  getCapitalizedName(): string {
    const user = this.currentUser();
    return user ? capitalizeFirstLetter(user.username) : '';
  }
}
