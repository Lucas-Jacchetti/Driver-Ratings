import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon.component';
import { MOCK_JAPAN_GP_COMMUNITY, MockDriverRow, scoreColorClass } from '../../../../shared/mock/f1-mock-data';

interface MockRaceOption {
  id: string;
  label: string;
  circuit: string;
  date: string;
  laps: number;
  rated: boolean;
  drivers: MockDriverRow[];
}

// Dado mockado só pra popular a tela -- quando integrar, isso vira uma
// chamada a RacesService.getAll() + RatingsService por corrida.
const MOCK_RACES: MockRaceOption[] = [
  {
    id: 'japao-2024',
    label: 'Japão',
    circuit: 'Suzuka International Racing Course',
    date: '07 Abr 2024',
    laps: 53,
    rated: false,
    drivers: MOCK_JAPAN_GP_COMMUNITY,
  },
  { id: 'bahrein-2024', label: 'Bahrein', circuit: 'Bahrain International Circuit', date: '02 Mar 2024', laps: 57, rated: true, drivers: [] },
  { id: 'australia-2024', label: 'Austrália', circuit: 'Albert Park Circuit', date: '24 Mar 2024', laps: 58, rated: true, drivers: [] },
];

@Component({
  selector: 'app-races-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <h1 class="text-xl font-bold text-white">Corridas</h1>
    <p class="mb-5 text-sm text-gray-500">Avaliações da comunidade por corrida</p>

    <div class="mb-5 flex flex-wrap items-center gap-3">
      <select
        class="rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-red-600 focus:outline-none"
        [(ngModel)]="selectedYear"
        name="year"
      >
        <option value="2024">2024</option>
        <option value="2023">2023</option>
      </select>

      <select
        class="rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-red-600 focus:outline-none"
        [(ngModel)]="selectedRaceId"
        name="race"
      >
        @for (race of races; track race.id) {
          <option [value]="race.id">{{ race.label }}</option>
        }
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

    @if (selectedRace) {
      <div class="mb-4 flex flex-col gap-2 border-b border-gray-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-bold text-red-500">{{ selectedYear }}</p>
          <h2 class="text-lg font-bold text-white">Grande Prêmio do {{ selectedRace.label }}</h2>
          <p class="text-sm text-gray-500">{{ selectedRace.circuit }} · {{ selectedRace.date }} · {{ selectedRace.laps }} voltas</p>
        </div>
        @if (!selectedRace.rated) {
          <span class="w-fit shrink-0 rounded bg-red-950 px-3 py-1 text-xs font-semibold text-red-400">Ainda não avaliada</span>
        }
      </div>

      @if (selectedRace.drivers.length) {
        <div class="space-y-2">
          @for (row of selectedRace.drivers; track row.driverId) {
            <div class="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900/40 px-5 py-3">
              <span class="w-6 shrink-0 text-xs font-semibold text-gray-500">{{ row.flag }}</span>
              <div class="w-48 shrink-0">
                <p class="truncate font-semibold text-white">{{ row.name }}</p>
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
      } @else {
        <p class="py-8 text-center text-sm text-gray-500">Nenhuma avaliação encontrada para esta corrida ainda.</p>
      }
    }
  `,
})
export class RacesPageComponent {
  races = MOCK_RACES;
  selectedYear = '2024';
  selectedRaceId = this.races[0].id;
  onlyMine = false;

  scoreColorClass = scoreColorClass;

  get selectedRace(): MockRaceOption | undefined {
    return this.races.find((r) => r.id === this.selectedRaceId);
  }
}
