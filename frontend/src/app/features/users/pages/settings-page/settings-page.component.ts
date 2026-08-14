import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon.component';
import { AuthService } from '../../../auth/services/auth.service';

interface PreferenceToggle {
  key: 'raceNotifications' | 'darkMode' | 'publicRatings';
  label: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <h1 class="text-xl font-bold text-white">Configurações</h1>
    <p class="mb-5 text-sm text-gray-500">Preferências da sua conta</p>

    <div class="mb-6 divide-y divide-gray-800 rounded-lg border border-gray-800 bg-[#141414]">
      @for (pref of preferences; track pref.key) {
        <div class="flex items-center justify-between px-5 py-4">
          <div>
            <p class="text-sm font-medium text-white">{{ pref.label }}</p>
            <p class="text-xs text-gray-500">{{ pref.description }}</p>
          </div>
          <input
            type="checkbox"
            class="toggle-switch shrink-0"
            [checked]="pref.enabled"
            (change)="pref.enabled = !pref.enabled"
          />
        </div>
      }
    </div>

    <div class="rounded-lg border border-gray-800 bg-[#141414]">
      <p class="px-5 pt-4 text-sm font-bold text-white">Conta</p>
      <div class="divide-y divide-gray-800">
        <button type="button" class="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-gray-300 hover:text-white">
          <app-icon name="key" [size]="16" />
          Alterar senha
        </button>
        <button type="button" class="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-gray-300 hover:text-white">
          <app-icon name="edit" [size]="16" />
          Editar perfil
        </button>
        <button
          type="button"
          class="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-red-500 hover:text-red-400"
          (click)="logout()"
        >
          <app-icon name="logout" [size]="16" />
          Sair da conta
        </button>
      </div>
    </div>
  `,
})
export class SettingsPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  preferences: PreferenceToggle[] = [
    { key: 'raceNotifications', label: 'Notificações de corridas', description: 'Receba alertas antes de cada corrida', enabled: true },
    { key: 'darkMode', label: 'Modo escuro', description: 'Tema escuro para a interface', enabled: true },
    { key: 'publicRatings', label: 'Avaliações públicas', description: 'Permite que outros vejam suas avaliações', enabled: true },
  ];

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
