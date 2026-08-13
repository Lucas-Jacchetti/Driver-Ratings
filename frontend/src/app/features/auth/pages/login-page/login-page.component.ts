import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center gap-4 py-24">
      <h1 class="text-2xl font-bold">F1 Ratings</h1>
      <!-- TODO: renderizar o botão real do Google Identity Services aqui,
           chamando authService.loginWithGoogle(idToken) no callback -->
      <button
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        (click)="fakeLogin()"
      >
        Entrar com Google
      </button>
    </div>
  `,
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  fakeLogin(): void {
    // Placeholder até integrar o Google Identity Services de verdade.
    console.log('Integrar com o botão real do Google aqui.');
  }
}
