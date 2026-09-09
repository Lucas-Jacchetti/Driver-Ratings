import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GoogleLoginRequest } from '../models/auth.model';
import { UserResponseDTO } from '../../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private _currentUser = signal<UserResponseDTO | null>(null);
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = computed(() => this._currentUser() !== null);

  isAdmin = computed(() => this._currentUser()?.role === 'Admin');

  loginWithGoogle(idToken: string): Observable<UserResponseDTO> {
    const request: GoogleLoginRequest = { idToken };
   
    return this.http
      .post<UserResponseDTO>(`${environment.apiUrl}/auth/google`, request)
      .pipe(tap((user) => this._currentUser.set(user)));
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
      next: () => this._currentUser.set(null),
      error: () => this._currentUser.set(null),
    });
  }

  refreshCurrentUser(): Observable<UserResponseDTO> {
    return this.http
      .get<UserResponseDTO>(`${environment.apiUrl}/user/me`)
      .pipe(tap((user) => this._currentUser.set(user)));
  }

  initSession(): Observable<UserResponseDTO | null> {
    return this.refreshCurrentUser().pipe(
      catchError(() => {
        this._currentUser.set(null);
        return of(null);
      })
    );
  }
}