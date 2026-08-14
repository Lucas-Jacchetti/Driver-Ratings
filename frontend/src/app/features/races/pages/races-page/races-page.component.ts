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
        class="rounded-md border border-gray-800 bg-[#141414] px-3 py-2 text-sm text-gray-200 focus:border-red-600 focus:outline-none"
        [(ngModel)]="selectedYear"
        name="year"
      >
        <option value="2024">2024</option>
        <option value="2023">2023</option>
      </select>

      <select
        class="rounded-md border border-gray-800 bg-[#141414] px-3 py-2 text-sm text-gray-200 focus:border-red-600 focus:outline-none"
        [(ngModel)]="selectedRaceId"
        name="race"
      >
        @for (race of races; track race.id) {
          <option [value]="race.id">{{ race.label }}</option>
        }
      </select>

      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium border"
        [class.bg-red-600]="onlyMine"
        [class.text-white]="onlyMine"
        [class.hover:bg-red-700]="onlyMine"
        [class.bg-[#141414]]="!onlyMine"
        [class.border-red-600]="onlyMine"
        [class.border-gray-800]="!onlyMine"
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
          <span class="w-fit shrink-0 rounded bg-red-950 px-3 py-1 text-xs font-semibold text-red-400">Não avaliada</span>
        }
      </div>

      @if (selectedRace.drivers.length) {
        <div class="space-y-2">
          @for (row of selectedRace.drivers; track row.driverId) {
            <div class="rounded-2xl border border-gray-800 bg-[#141414] px-5 py-4">
              <div class="flex flex-wrap items-center gap-6">
                <div class="flex min-w-[220px] items-center gap-3">
                  <span class="shrink-0 text-xl leading-none">{{ row.flag }}</span>
                  <div>
                    <div class="text-base font-black uppercase leading-tight text-white">{{ row.name }}</div>
                    <div class="mt-0.5 flex items-center gap-1.5">
                      <span class="h-2.5 w-2.5 rounded-full shrink-0" [style.background]="row.teamColor"></span>
                      <span class="text-xs text-white/50">{{ row.team }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex shrink-0 items-center gap-3">
                  <div class="text-center">
                    <div class="mb-0.5 text-[10px] uppercase tracking-[0.2em] text-white/40">Largada</div>
                    <div class="text-base font-black text-gray-300">P{{ row.startPosition }}</div>
                  </div>
                  <svg width="18" height="10" viewBox="0 0 20 10" class="opacity-30" aria-hidden="true">
                    <path d="M0 5h14M11 1l5 4-5 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="text-center">
                    <div class="mb-0.5 text-[10px] uppercase tracking-[0.2em] text-white/40">Chegada</div>
                    <div class="text-base font-black text-white">P{{ row.finishPosition }}</div>
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

              <div class="mt-4">
                <button
                  type="button"
                  class="flex items-center gap-2 text-xs text-white/40"
                  (click)="toggleContext(row.driverId)"
                >
                  <span class="inline-flex transition-transform" [class.rotate-90]="contextOpen[row.driverId]">
                    <app-icon name="chevron-right" [size]="12" />
                  </span>
                  Contexto
                </button>

                @if (contextOpen[row.driverId]) {
                  <p class="mt-2 text-xs leading-relaxed text-gray-400">
                    {{ driverContext(row) }}
                  </p>
                }
              </div>
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
  contextOpen: Record<string, boolean> = {};

  scoreColorClass = scoreColorClass;

  get selectedRace(): MockRaceOption | undefined {
    return this.races.find((r) => r.id === this.selectedRaceId);
  }

  toggleContext(driverId: string): void {
    this.contextOpen[driverId] = !this.contextOpen[driverId];
  }

  driverContext(row: MockDriverRow): string {
    const contexts: Record<string, string> = {
      verstappen: 'Liderou a prova com ritmo superior e controlou a vantagem sem comprometer a estratégia.',
      perez: 'Manteve a consistência e não abriu espaço para erros durante a maior parte da corrida.',
      sainz: 'Boa arrancada e execução de estratégia, com ritmo suficiente para ganhar terreno na fase central.',
      leclerc: 'Mostrou bom potencial em trechos, mas perdeu eficiência em momentos decisivos da corrida.',
      norris: 'Ritmo sólido e muito consistente, com boa leitura de pneus durante a prova.',
      piastri: 'Estreia muito boa, equilibrando ritmo e defensiva com maturidade acima da média.',
      hamilton: 'Teve dificuldades de aderência e pouco ritmo em comparação com os rivais do topo.',
      russell: 'Corrida regular, com boa gestão e pouco risco ao longo do fim de prova.',
      alonso: 'Extraíu o máximo do carro com uma condução inteligente e boa leitura do desgaste.',
      tsunoda: 'Presença forte em ritmo puro, ainda sem aproveitar totalmente as oportunidades de ultrapassagem.',
    };

    return contexts[row.driverId] ?? 'Desempenho consistente com boa gestão de pneus e pouco desgaste de borracha.';
  }
}
