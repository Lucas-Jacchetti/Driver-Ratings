import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon.component';
import { AuthGateComponent } from '../../../../shared/components/auth-gate.component';
import { AuthService } from '../../../auth/services/auth.service';
import { RacesService } from '../../../races/services/races.service';
import { RatingsService } from '../../../ratings/services/ratings.service';
import { RaceResponseDTO } from '../../../races/models/race.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';


const TEAM_COLORS: Record<string, string> = {
  'Red Bull Racing': '#3671C6',
  Ferrari: '#E8002D',
  McLaren: '#FF8000',
  Mercedes: '#27F4D2',
  'Aston Martin': '#229971',
  Alpine: '#2293D1',
  Williams: '#64C4FF',
  "Racing Bulls": '#6692FF',
  Audi: '#8B0000',
  Haas: '#FFFFFF',
  Cadillac: '#C0C0C0',
};

const TEAM_ORDER = [
  'McLaren',
  'Mercedes',
  'Red Bull Racing',
  'Ferrari',
  'Racing Bulls',
  'Williams',
  'Aston Martin',
  'Haas',
  'Audi',
  'Alpine',
  'Cadillac',
];

function teamOrderIndex(teamName: string): number {
  const index = TEAM_ORDER.indexOf(teamName);
  return index === -1 ? TEAM_ORDER.length : index; 
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, AuthGateComponent, LoadingSpinnerComponent],
  template: `
    @if (loading()) {
      <app-loading-spinner />
    } @else {
      @if (race(); as r) {
        <div class="mb-6 flex flex-col gap-4 rounded-lg border border-gray-800 bg-[#141414] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-red-500">Corrida Atual</p>
            <h1 class="text-xl font-bold text-white">{{ r.name }}</h1>
            <p class="mt-1 text-sm text-gray-400">{{ r.circuit }}</p>
          </div>
          <div class="flex gap-6">
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-500">Data</p>
              <p class="text-sm font-medium text-white">{{ r.date }}</p>
            </div>
          </div>
        </div>

        <app-auth-gate message="Você precisa estar logado pra avaliar os pilotos.">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-white">
                {{ alreadyRated() ? 'Suas Avaliações' : 'Avalie os Pilotos' }}
              </h2>
              <p class="text-sm text-gray-500">
                {{
                  editing()
                    ? 'Ajuste as notas e salve as alterações.'
                    : alreadyRated()
                      ? 'Essas foram as notas que você deu pra cada piloto nessa corrida.'
                      : 'Dê sua nota de 0 a 10 para o desempenho de cada piloto.'
                }}
              </p>
            </div>

            @if (alreadyRated() && !editing()) {
              <button
                type="button"
                class="rounded-lg bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-200 hover:bg-gray-700"
                (click)="startEditing()"
              >
                Editar avaliações
              </button>
            }
          </div>

          <div class="space-y-3">
            @for (result of r.driverRaceResults; track result.id) {
              <div class="rounded-2xl border border-gray-800 bg-[#141414] px-6 py-7">
                <div class="flex flex-wrap items-start gap-6">
                  <div class="flex w-56 shrink-0 items-start gap-3">
                    <div>
                      <div class="text-xl font-black leading-tight text-white">
                        {{ result.driverSeason.driver.name }}
                      </div>
                      <div class="mt-0.5 flex items-center gap-1.5">
                        <span
                          class="h-2.5 w-2.5 shrink-0 rounded-full opacity-80"
                          [style.background]="teamColor(result.driverSeason.team.name)"
                        ></span>
                        <span class="text-xs text-white/50">{{ result.driverSeason.team.name }}</span>
                      </div>

                      <button
                        type="button"
                        class="mt-1.5 flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
                        (click)="toggleContext(result.id)"
                      >
                        <span class="inline-flex transition-transform" [class.rotate-90]="contextOpen[result.id]">
                          <app-icon name="chevron-right" [size]="12" />
                        </span>
                        Contexto
                      </button>

                      
                    </div>
                  </div>

                  <div class="flex shrink-0 items-center gap-3">
                    <div class="text-center">
                      <div class="mb-0.5 text-[10px] uppercase tracking-[0.2em] text-white/40">Started</div>
                      <div class="text-lg font-black text-gray-300">P{{ result.startingPosition }}</div>
                    </div>
                    <div class="text-center">
                      <div class="mb-0.5 text-[10px] uppercase tracking-[0.2em] text-white/40">Finished</div>
                      <div class="text-lg font-black text-white">{{ finishLabel(result.finishingPosition) }}</div>
                    </div>
                  </div>

                  <div class="flex min-w-[220px] flex-1 items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      class="rating-slider flex-1"
                      [class.cursor-not-allowed]="!isEditable()"
                      [class.opacity-50]="!isEditable()"
                      [style.background]="trackBackground(scores[result.id])"
                      [disabled]="!isEditable()"
                      [(ngModel)]="scores[result.id]"
                      [name]="'score-' + result.id"
                    />
                    <span
                      class="w-12 shrink-0 text-right text-3xl font-black leading-none"
                      [class]="scoreColorClass(scores[result.id])"
                    >
                      {{ (scores[result.id] ?? 0).toFixed(1) }}
                    </span>
                  </div>
                </div>
                @if (contextOpen[result.id]) {
                  <p class="mt-2 text-xs leading-relaxed text-gray-400">
                    {{ result.context || 'No additional context for this driver.' }}
                  </p>
                }
              </div>
            }
          </div>

          @if (!alreadyRated()) {
            <div class="mt-6 flex justify-end">
              <button
                type="button"
                class="rounded-xl bg-[#e10600] px-6 py-3 text-sm font-semibold text-white"
                (click)="submit()"
              >
                Enviar avaliações
              </button>
            </div>
          } @else if (editing()) {
            <div class="mt-6 flex justify-end gap-3">
              <button
                type="button"
                class="rounded-xl bg-gray-800 px-6 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-700"
                (click)="cancelEditing()"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="rounded-xl bg-[#e10600] px-6 py-3 text-sm font-semibold text-white"
                (click)="update()"
              >
                Salvar alterações
              </button>
            </div>
          }
        </app-auth-gate>
      }
    }
  `,
})
export class HomePageComponent implements OnInit {
  private racesService = inject(RacesService);
  private ratingsService = inject(RatingsService);

  authService = inject(AuthService);

  race = signal<RaceResponseDTO | null>(null);
  loading = signal(true);
  alreadyRated = signal(false);
  editing = signal(false);
  scores: Record<string, number | undefined> = {};
  contextOpen: Record<string, boolean> = {};

  private originalScores: Record<string, number | undefined> = {};

  ngOnInit(): void {
    this.racesService.getById('019ff221-4c49-732b-a88a-40a991b6b180').subscribe({
      next: (race) => {
        race.driverRaceResults = [...race.driverRaceResults].sort(
          (a, b) =>
            teamOrderIndex(a.driverSeason.team.name) - teamOrderIndex(b.driverSeason.team.name) ||
            a.driverSeason.driverNumber - b.driverSeason.driverNumber
        );
        this.race.set(race);
        this.loading.set(false);

        for (const result of race.driverRaceResults) {
          this.scores[result.id] = 5;
          this.contextOpen[result.id] = false;
        }

        if (this.authService.isAuthenticated()) {
          this.ratingsService.getUserRaceRatings(race.id).subscribe((userRatings) => {
            if (userRatings.length === 0) return;

            this.alreadyRated.set(true);

            for (const rating of userRatings) {
              const result = race.driverRaceResults.find(
                (r) => r.driverSeason.id === rating.driverSeasonId
              );
              if (result) {
                this.scores[result.id] = rating.averageRating;
              }
            }

            this.originalScores = { ...this.scores };
          });
        }
      },
      error: () => this.loading.set(false),
    });
  }

  isEditable(): boolean {
    return !this.alreadyRated() || this.editing();
  }

  toggleContext(resultId: string): void {
    this.contextOpen[resultId] = !this.contextOpen[resultId];
  }

  teamColor(teamName: string): string {
    return TEAM_COLORS[teamName] ?? '#6b7280';
  }

  finishLabel(position: number): string {
    return position === 0 ? 'DNF' : `P${position}`;
  }

  scoreColorClass(score: number | undefined): string {
    const value = score ?? 0;
    if (value >= 8) return 'text-emerald-400';
    if (value >= 6) return 'text-yellow-400';
    if (value >= 4) return 'text-orange-400';
    return 'text-red-400';
  }

  trackBackground(score: number | undefined): string {
    const pct = ((score ?? 0) / 10) * 100;
    return `linear-gradient(to right, #ff1f1f 0%, #ff1f1f ${pct}%, #374151 ${pct}%, #374151 100%)`;
  }

  startEditing(): void {
    this.editing.set(true);
  }

  cancelEditing(): void {
    this.scores = { ...this.originalScores };
    this.editing.set(false);
  }

  submit(): void {
    const race = this.race();
    if (!race) return;

    const ratings = race.driverRaceResults
      .filter((r) => this.scores[r.id] != null)
      .map((r) => ({ driverRaceResultId: r.id, score: this.scores[r.id]! }));

    this.ratingsService.submitRatings({ raceId: race.id, ratings }).subscribe(() => {
      this.alreadyRated.set(true);
      this.originalScores = { ...this.scores };
    });
  }

  update(): void {
    const race = this.race();
    if (!race) return;

    const ratings = race.driverRaceResults
      .filter((r) => this.scores[r.id] != null)
      .map((r) => ({ driverRaceResultId: r.id, score: this.scores[r.id]! }));

    this.ratingsService.updateRatings({ raceId: race.id, ratings }).subscribe(() => {
      this.originalScores = { ...this.scores };
      this.editing.set(false);
    });
  }
}