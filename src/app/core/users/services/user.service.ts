import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  #users = signal<User[]>([]);
  users = this.#users.asReadonly();

  list() {
    return this.httpClient.get<User[]>(this.apiUrl).subscribe((data) => {
      this.#users.set(data);
    });
  }
}
