import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthResponseDTO, GoogleLoginRequest } from '../models/auth.model';

const TOKEN_KEY = 'f1ratings_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  loginWithGoogle(idToken: string): Observable<AuthResponseDTO> {
    const request: GoogleLoginRequest = { idToken };
    return this.http
      .post<AuthResponseDTO>(`${environment.apiUrl}/auth/google`, request)
      .pipe(tap((response) => this.saveToken(response.token)));
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
