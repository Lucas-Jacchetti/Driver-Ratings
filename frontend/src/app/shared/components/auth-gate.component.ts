import { Component, Input, inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { GoogleLoginButtonComponent } from './google-login-button.component';

@Component({
  selector: 'app-auth-gate',
  standalone: true,
  imports: [GoogleLoginButtonComponent],
  template: `
    @if (authService.isAuthenticated()) {
      <ng-content />
    } @else {
      <div class="flex flex-col items-center gap-4 rounded-lg border border-gray-800 bg-[#141414] px-6 py-12 text-center">
        <p class="text-sm text-gray-400">{{ message }}</p>
        <app-google-login-button />
      </div>
    }
  `,
})
export class AuthGateComponent {
  authService = inject(AuthService);
  @Input() message = 'Você precisa estar logado pra ver isso.';
}