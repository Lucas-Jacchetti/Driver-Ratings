import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div class="max-w-6xl mx-auto flex items-center gap-6">
        <span class="font-bold text-red-500">F1 Ratings</span>
        <a routerLink="/races" class="text-sm text-gray-300 hover:text-white">Corridas</a>
        <a routerLink="/drivers" class="text-sm text-gray-300 hover:text-white">Pilotos</a>
        <a routerLink="/seasons" class="text-sm text-gray-300 hover:text-white">Temporadas</a>
        <a routerLink="/communities" class="text-sm text-gray-300 hover:text-white">Comunidades</a>
        <a routerLink="/profile" class="text-sm text-gray-300 hover:text-white ml-auto">Perfil</a>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  private authService = inject(AuthService);
}
