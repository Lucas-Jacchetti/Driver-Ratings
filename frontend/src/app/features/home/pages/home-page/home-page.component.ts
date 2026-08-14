import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon.component';
import { MOCK_MY_JAPAN_DRAFT, MockDriverRow, scoreColorClass } from '../../../../shared/mock/f1-mock-data';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="mb-6 flex flex-col gap-4 rounded-lg border border-gray-800 bg-gray-900/40 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-red-500">Corrida Atual</p>
        <h1 class="text-xl font-bold text-white">{{ currentRace.name }}</h1>
        <p class="mt-1 text-sm text-gray-400">{{ currentRace.flag }} {{ currentRace.circuit }}</p>
      </div>
      <div class="flex gap-6">
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-500">Data</p>
          <p class="text-sm font-medium text-white">{{ currentRace.date }}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-500">Voltas</p>
          <p class="text-sm font-medium text-white">{{ currentRace.laps }}</p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-500">Circuito</p>
          <p class="text-sm font-medium text-white">{{ currentRace.length }}</p>
        </div>
      </div>
    </div>

    <h2 class="text-lg font-bold text-white">Avalie os Pilotos</h2>
    <p class="mb-4 text-sm text-gray-500">Dê sua nota de 0 a 10 para o desempenho de cada piloto.</p>

    <div class="space-y-3">
      @for (row of drivers; track row.driverId; let i = $index) {
        <div class="flex flex-col gap-4 rounded-lg border border-gray-800 bg-gray-900/40 px-5 py-4 sm:flex-row sm:items-center">
          <div class="flex w-full items-start gap-3 sm:w-56 sm:shrink-0">
            <span class="pt-0.5 text-xs font-semibold text-gray-500">{{ row.flag }}</span>
            <div class="min-w-0">
              <p class="truncate font-semibold text-white">{{ row.name }}</p>
              <p class="flex items-center gap-1.5 text-xs text-gray-500">
                <span class="h-1.5 w-1.5 rounded-full" [style.background]="row.teamColor"></span>
                {{ row.team }}
              </p>
              <button
                type="button"
                class="mt-1 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300"
                (click)="contextOpen[i] = !contextOpen[i]"
              >
                <span class="inline-flex transition-transform" [class.rotate-90]="contextOpen[i]">
                  <app-icon name="chevron-right" [size]="12" />
                </span>
                Contexto
              </button>
              @if (contextOpen[i]) {
                <textarea
                  rows="2"
                  class="mt-2 w-full rounded border border-gray-700 bg-gray-800 p-2 text-xs text-gray-300 placeholder-gray-500 focus:border-red-600 focus:outline-none"
                  placeholder="Adicione contexto sobre esse desempenho (opcional)"
                  [(ngModel)]="contexts[i]"
                  [name]="'context-' + row.driverId"
                ></textarea>
              }
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-2 text-xs text-gray-500 sm:w-32">
            <div class="text-center">
              <p class="uppercase tracking-wide">Largada</p>
              <p class="font-medium text-gray-300">P{{ row.startPosition }}</p>
            </div>
            <app-icon name="chevron-right" [size]="13" />
            <div class="text-center">
              <p class="uppercase tracking-wide">Chegada</p>
              <p class="font-semibold text-white">P{{ row.finishPosition }}</p>
            </div>
          </div>

          <div class="flex flex-1 items-center gap-4">
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              class="rating-slider flex-1"
              [style.background]="trackBackground(row.score)"
              [(ngModel)]="row.score"
              [name]="'score-' + row.driverId"
            />
            <span class="w-12 text-right text-lg font-bold" [class]="scoreColorClass(row.score)">
              {{ row.score.toFixed(1) }}
            </span>
          </div>
        </div>
      }
    </div>

    <button
      type="button"
      class="mt-6 rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
    >
      Enviar avaliações
    </button>
  `,
})
export class HomePageComponent {
  // Mock -- em breve isso vem de RacesService, pegando a corrida mais
  // recente ainda sem avaliação do usuário.
  currentRace = {
    name: 'Grande Prêmio do Japão',
    circuit: 'Suzuka International Racing Course',
    flag: '🇯🇵',
    date: '07 Abr 2024',
    laps: 53,
    length: '5.807 km',
  };

  drivers: MockDriverRow[] = MOCK_MY_JAPAN_DRAFT.map((d) => ({ ...d }));
  contextOpen: boolean[] = this.drivers.map(() => false);
  contexts: string[] = this.drivers.map(() => '');

  scoreColorClass = scoreColorClass;

  trackBackground(score: number): string {
    const pct = (score / 10) * 100;
    return `linear-gradient(to right, #dc2626 0%, #dc2626 ${pct}%, #374151 ${pct}%, #374151 100%)`;
  }
}
