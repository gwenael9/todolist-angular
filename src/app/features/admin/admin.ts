import { Component, inject, effect, signal } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { UserService } from '../../core/users/services/user.service';
import { User } from '../../core/users/interfaces/user';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [BadgeModule, TableModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent {
  private userService = inject(UserService);

  displayedUsers = signal<User[]>([]);

  constructor() {
    this.userService.list();

    effect(() => {
      this.displayedUsers.set(this.userService.users());
    });
  }

  ban(user: User): void {
    const confirmed = window.confirm(`Voulez-vous vraiment bannir ${user.username} ?`);
    if (!confirmed) return;
    this.displayedUsers.update(users => users.filter(u => u.id !== user.id));
  }
}
