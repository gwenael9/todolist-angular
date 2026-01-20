import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { Credentials, LoginResponse } from '../interfaces/credentials';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient: HttpClient = inject(HttpClient);
  private apiUrl: string = `${environment.apiUrl}/auth`;

  private currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  constructor() {
    this.currentUser.set(this.getUserFromToken());
  }

  register(credentials: Credentials): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: Credentials): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token);
        this.setUserFromToken(response.access_token);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  private setUserFromToken(token: string): void {
    try {
      const decoded = jwtDecode(token);
      this.currentUser.set(decoded as User);
    } catch (error) {
      this.logout();
    }
  }

  private getUserFromToken(): User | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode(token) as User;
    } catch {
      return null;
    }
  }
}
