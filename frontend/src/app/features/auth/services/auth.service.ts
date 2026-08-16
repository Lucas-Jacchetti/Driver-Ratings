import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthResponseDTO, GoogleLoginRequest } from '../models/auth.model';
import { UserResponseDTO } from '../../../shared/models/user.model';

const TOKEN_KEY = 'f1ratings_token';
const USER_KEY = 'f1ratings_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private _currentUser = signal<UserResponseDTO | null>(this.readStoredUser());
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = computed(() => this._currentUser() !== null);

  loginWithGoogle(idToken: string): Observable<AuthResponseDTO> {
    const request: GoogleLoginRequest = { idToken };
    return this.http
      .post<AuthResponseDTO>(`${environment.apiUrl}/auth/google`, request)
      .pipe(tap((response) => this.saveSession(response)));
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
  }

  private saveSession(response: AuthResponseDTO): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this._currentUser.set(response.user);
  }

  private readStoredUser(): UserResponseDTO | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}