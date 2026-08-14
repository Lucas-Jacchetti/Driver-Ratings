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
        class="rounded-md border border-gray-800 bg-[#141414] px-3 py-2 text-sm text-gray-200 focus:border-red-600 focus:outline-none"
        [(ngModel)]="selectedYear"
        name="year"
      >
        <option value="2024">2024</option>
        <option value="2023">2023</option>
      </select>

      <button
        type="button"
        class="app-button-secondary"
        [class.bg-red-600]="onlyMine"
        [class.text-white]="onlyMine"
        [class.border-red-600]="onlyMine"
        [class.hover:bg-red-700]="onlyMine"
        (click)="onlyMine = !onlyMine"
      >
        <app-icon name="user" [size]="15" />
        Minhas Avaliações
      </button>
    </div>

    <div class="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-gray-800 bg-[#141414] p-4 sm:grid-cols-4">
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
        <div class="rounded-2xl border border-gray-800 bg-[#141414] px-5 py-4">
          <div class="flex flex-wrap items-center gap-6">
            <div class="flex min-w-[220px] items-center gap-3">
              <span class="shrink-0 text-xl leading-none">{{ row.flag }}</span>
              <div>
                <div class="text-base font-black uppercase leading-tight text-white">{{ row.name }}</div>
                <div class="mt-0.5 flex items-center gap-1.5">
                  <span class="h-2.5 w-2.5 rounded-[4px] shrink-0 opacity-80" [style.background]="row.teamColor"></span>
                  <span class="text-xs text-white/50">{{ row.team }}</span>
                </div>
              </div>
            </div>

            <div class="flex min-w-[220px] flex-1 items-center gap-4">
              <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-[#252525]">
                <div class="h-full rounded-full bg-[#ff1f1f]" [style.width.%]="row.score * 10"></div>
              </div>
              <span class="w-12 shrink-0 text-right text-3xl font-black leading-none" [class]="scoreColorClass(row.score)">
                {{ row.score.toFixed(1) }}
              </span>
            </div>
          </div>
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
