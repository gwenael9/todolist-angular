import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, tap } from 'rxjs';
import { Credentials, LoginResponse } from '../interfaces/credentials';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient: HttpClient = inject(HttpClient);
  private apiUrl: string = `${environment.apiUrl}/auth`;

  register(credentials: Credentials): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: Credentials): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
        }
      }),
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
