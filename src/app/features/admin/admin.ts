import { Component, inject } from '@angular/core';
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

  users = this.userService.users;

  constructor() {
    this.userService.list();
  }

  ban(user: User) {
    console.log('Bannir :', user);
  }

}
