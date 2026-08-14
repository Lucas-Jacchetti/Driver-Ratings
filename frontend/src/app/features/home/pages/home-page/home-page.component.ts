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
    <div class="mb-6 flex flex-col gap-4 rounded-lg border border-gray-800 bg-[#141414] p-5 sm:flex-row sm:items-center sm:justify-between">
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
        <div class="rounded-2xl border border-gray-800 bg-[#141414] px-6 py-7">
          <div class="flex flex-wrap items-center gap-6">
            <div class="flex min-w-[220px] items-center gap-3">
              <span class="shrink-0 text-2xl leading-none">{{ row.flag }}</span>
              <div>
                <div class="text-xl font-black uppercase leading-tight text-white">{{ row.name }}</div>
                <div class="mt-0.5 flex items-center gap-1.5">
                  <span class="h-2.5 w-2.5 rounded-full opacity-80" [style.background]="row.teamColor"></span>
                  <span class="text-xs text-white/50">{{ row.team }}</span>
                </div>
              </div>
            </div>

            <div class="flex shrink-0 items-center gap-3">
              <div class="text-center">
                <div class="mb-0.5 text-[10px] uppercase tracking-[0.2em] text-white/40">Largada</div>
                <div class="text-lg font-black text-gray-300">P{{ row.startPosition }}</div>
              </div>
              <svg width="18" height="10" viewBox="0 0 20 10" class="opacity-30" aria-hidden="true">
                <path d="M0 5h14M11 1l5 4-5 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="text-center">
                <div class="mb-0.5 text-[10px] uppercase tracking-[0.2em] text-white/40">Chegada</div>
                <div class="text-lg font-black text-white">P{{ row.finishPosition }}</div>
              </div>
            </div>

            <div class="flex min-w-[220px] flex-1 items-center gap-4">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                class="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-[#ff1f1f]"
                [style.background]="trackBackground(row.score)"
                [(ngModel)]="row.score"
                [name]="'score-' + row.driverId"
              />
              <span class="w-12 shrink-0 text-right text-3xl font-black leading-none" [class]="scoreColorClass(row.score)">
                {{ row.score.toFixed(1) }}
              </span>
            </div>
          </div>

          <div class="mt-4">
            <button
              type="button"
              class="flex items-center gap-2 text-xs text-white/40"
              (click)="contextOpen[i] = !contextOpen[i]"
            >
              <span class="inline-flex transition-transform" [class.rotate-90]="contextOpen[i]">
                <app-icon name="chevron-right" [size]="12" />
              </span>
              Contexto
            </button>

            @if (contextOpen[i]) {
              <p class="mt-2 text-xs leading-relaxed text-gray-400">
                {{ contexts[i] || 'Sem contexto adicional para este piloto.' }}
              </p>
            }
          </div>
        </div>
      }
    </div>

    <div class="mt-6 flex justify-end">
      <button
        type="button"
        class="rounded-xl bg-[#e10600] px-6 py-3 text-sm font-semibold text-white"
      >
        Enviar avaliações
      </button>
    </div>
  `,
})
export class HomePageComponent {
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
  contexts: string[] = this.drivers.map((driver) => this.defaultContext(driver.driverId));

  scoreColorClass = scoreColorClass;

  private defaultContext(driverId: string): string {
    const map: Record<string, string> = {
      verstappen: 'Controlou a corrida com confiança, mantendo ritmo superior e pressão constante sobre os rivais.',
      perez: 'Manteve a posição com boa consistência e aproveitou a estratégia sem riscos desnecessários.',
      sainz: 'Boa execução da corrida, saiu bem da curva e aproveitou o ritmo para recuperar posições.',
      leclerc: 'Teve bons momentos, mas perdeu eficiência em momentos decisivos da estratégia.',
      norris: 'Mostrou bom ritmo no meio da corrida, porém sem conseguir tirar proveito completo do potencial.',
      piastri: 'Estreia sólida, com boa leitura de pneus e bastante consistência durante a prova.',
      hamilton: 'Corrida abaixo do esperado, com dificuldades em ritmo e concorrência direta.',
      russell: 'Manteve a regularidade, sem grandes erros e com boa gestão do desgaste.',
      alonso: 'Fez o máximo com o carro, buscando otimizar cada setor e tratando bem o desgaste dos pneus.',
      tsunoda: 'Desempenho sólido no ritmo, mas faltou agressividade nas fases mais importantes da prova.',
    };

    return map[driverId] ?? 'Desempenho consistente, com boa leitura da corrida e gestão de pneus.';
  }

  trackBackground(score: number): string {
    const pct = (score / 10) * 100;
    return `linear-gradient(to right, #ff1f1f 0%, #ff1f1f ${pct}%, #252525 ${pct}%, #252525 100%)`;
  }
}
