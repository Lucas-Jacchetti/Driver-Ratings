import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon.component';
import { MOCK_SEASON_2024, scoreColorClass } from '../../../../shared/mock/f1-mock-data';

@Component({
  selector: 'app-seasons-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <h1 class="text-xl font-bold text-white">Temporada</h1>
    <p class="mb-5 text-sm text-gray-500">Médias de avaliação ao longo da temporada</p>

    <div class="mb-5 flex flex-wrap items-center gap-3">
      <select
        class="rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-red-600 focus:outline-none"
        [(ngModel)]="selectedYear"
        name="year"
      >
        <option value="2024">2024</option>
        <option value="2023">2023</option>
      </select>

      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium"
        [class.bg-red-600]="onlyMine"
        [class.text-white]="onlyMine"
        [class.bg-gray-900]="!onlyMine"
        [class.text-gray-300]="!onlyMine"
        (click)="onlyMine = !onlyMine"
      >
        <app-icon name="user" [size]="15" />
        Minhas Avaliações
      </button>
    </div>

    <div class="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-gray-800 bg-gray-900/40 p-4 sm:grid-cols-4">
      <div>
        <p class="text-xs uppercase tracking-wide text-gray-500">Temporada</p>
        <p class="text-lg font-bold text-white">{{ selectedYear }}</p>
      </div>
      <div>
        <p class="text-xs uppercase tracking-wide text-gray-500">Corridas</p>
        <p class="text-lg font-bold text-white">{{ raceCount }}</p>
      </div>
      <div>
        <p class="text-xs uppercase tracking-wide text-gray-500">Pilotos</p>
        <p class="text-lg font-bold text-white">{{ drivers.length }}</p>
      </div>
      <div>
        <p class="text-xs uppercase tracking-wide text-gray-500">Melhor Avaliado</p>
        <p class="text-lg font-bold text-white">
          <span class="text-xs text-gray-500">{{ topDriver.flag }}</span>
          {{ topDriverLastName }}
        </p>
      </div>
    </div>

    <div class="space-y-2">
      @for (row of drivers; track row.driverId) {
        <div class="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900/40 px-5 py-3">
          <span class="w-6 shrink-0 text-xs font-semibold text-gray-500">{{ row.flag }}</span>
          <div class="w-48 shrink-0">
            <p class="truncate font-semibold text-white">{{ row.name.toUpperCase() }}</p>
            <p class="flex items-center gap-1.5 text-xs text-gray-500">
              <span class="h-1.5 w-1.5 rounded-full" [style.background]="row.teamColor"></span>
              {{ row.team }}
            </p>
          </div>
          <span class="w-20 shrink-0 text-center text-xs text-gray-500">P{{ row.startPosition }} → P{{ row.finishPosition }}</span>
          <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800">
            <div class="h-full rounded-full bg-red-600" [style.width.%]="row.score * 10"></div>
          </div>
          <span class="w-10 shrink-0 text-right text-base font-bold" [class]="scoreColorClass(row.score)">
            {{ row.score.toFixed(1) }}
          </span>
        </div>
      }
    </div>
  `,
})
export class SeasonsPageComponent {
  selectedYear = '2024';
  onlyMine = true;
  raceCount = 5;

  drivers = [...MOCK_SEASON_2024].sort((a, b) => b.score - a.score);

  scoreColorClass = scoreColorClass;

  get topDriver() {
    return this.drivers[0];
  }

  get topDriverLastName(): string {
    const parts = this.topDriver.name.split(' ');
    return parts[parts.length - 1];
  }
}
