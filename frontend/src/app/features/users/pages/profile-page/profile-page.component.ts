import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { scoreColorClass } from '../../../../shared/mock/f1-mock-data';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="text-xl font-bold text-white">Perfil</h1>
    <p class="mb-5 text-sm text-gray-500">Seu histórico de avaliações</p>

    <div class="mb-6 flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900/40 p-5">
      <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-600 text-xl font-semibold text-white">
        {{ user.initial }}
      </div>
      <div>
        <p class="text-lg font-bold text-white">{{ user.name }}</p>
        <p class="text-sm text-gray-500">{{ user.email }}</p>
        <p class="text-xs text-gray-600">Membro desde {{ user.memberSince }}</p>
      </div>
    </div>

    <div class="mb-6 grid grid-cols-2 gap-4">
      @for (stat of stats; track stat.label) {
        <div class="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
          <p class="text-2xl font-bold text-red-500">{{ stat.value }}</p>
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
        </div>
      }
    </div>

    <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Piloto Favorito</p>
    <div class="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/40 p-4">
      <span class="text-xs font-semibold text-gray-500">{{ favoriteDriver.flag }}</span>
      <div class="flex-1">
        <p class="font-semibold text-white">{{ favoriteDriver.name }}</p>
        <p class="text-xs text-gray-500">{{ favoriteDriver.team }}</p>
      </div>
      <span class="text-lg font-bold" [class]="scoreColorClass(favoriteDriver.score)">{{ favoriteDriver.score.toFixed(1) }}</span>
    </div>
  `,
})
export class ProfilePageComponent {
  // Mock -- substituir por UsersService.getById() quando integrar.
  user = {
    initial: 'L',
    name: 'Lucas',
    email: 'lucas@email.com',
    memberSince: 'Jan 2024',
  };

  stats = [
    { label: 'Corridas Avaliadas', value: '3' },
    { label: 'Pilotos Avaliados', value: '30' },
    { label: 'Média Geral Dada', value: '7.8' },
    { label: 'Seguidores', value: '14' },
  ];

  favoriteDriver = {
    flag: 'NL',
    name: 'Max Verstappen',
    team: 'Red Bull Racing',
    score: 9.1,
  };

  scoreColorClass = scoreColorClass;
}
