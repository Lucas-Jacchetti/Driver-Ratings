import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';
import { AuthGateComponent } from '../../../../shared/components/auth-gate.component';
import { AuthService } from '../../../auth/services/auth.service';
import { RacesService } from '../../services/races.service';
import { RaceResponseDTO, RaceSummaryDTO } from '../../models/race.model';
import { RatingsService } from '../../../ratings/services/ratings.service';
import { DriverSeasonRating } from '../../../ratings/models/rating.model';
import { SeasonSummaryDTO } from '../../../seasons/models/season.model';
import { SeasonsService } from '../../../seasons/services/seasons.service';

const TEAM_COLORS: Record<string, string> = {
  'Red Bull Racing': '#3671C6',
  Ferrari: '#E8002D',
  McLaren: '#FF8000',
  Mercedes: '#27F4D2',
  'Aston Martin': '#229971',
  Alpine: '#2293D1',
  Williams: '#64C4FF',
  'Racing Bulls': '#6692FF',
  Audi: '#8B0000',
  Haas: '#FFFFFF',
  Cadillac: '#C0C0C0',
};

@Component({
  selector: 'app-races-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, LoadingSpinnerComponent, AuthGateComponent],
  template: `
    <h1 class="text-xl font-bold text-white">Rankings</h1>
    <p class="mb-5 text-sm text-gray-500">Community ratings by race and season</p>

    <div class="mb-5 flex flex-wrap items-center gap-3">
      <select
        class="rounded-md border border-gray-800 bg-[#141414] px-3 py-2 text-sm text-gray-200 focus:border-red-600 focus:outline-none"
        [(ngModel)]="selectedYear"
        name="year"
      >
      @for (year of years(); track year.id) {
        <option [value]="year.year">{{ year.year }}</option>
      }
      </select>

      <select
        class="rounded-md border border-gray-800 bg-[#141414] px-3 py-2 text-sm text-gray-200 focus:border-red-600 focus:outline-none"
        [(ngModel)]="selectedRaceId"
        name="race"
        (ngModelChange)="onRaceChange()"
      >
        <option [value]="">All Races</option>
        @for (raceOption of races(); track raceOption.id) {
          <option [value]="raceOption.id">{{ raceOption.name }}</option>
        }
      </select>

      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
        [ngClass]="
          onlyMine
            ? 'border-red-600 bg-red-600 text-white hover:bg-red-700'
            : 'border-gray-800 bg-[#141414] text-gray-300 hover:border-gray-700'
        "
        (click)="toggleOnlyMine()"
      >
        <app-icon name="user" [size]="15" />
        My Ratings
      </button>
    </div>

    @if (loading()) {
      <app-loading-spinner />
    } @else {
      @if (selectedRace(); as r) {
        <div class="mb-6 flex flex-col gap-4 rounded-lg border border-gray-800 bg-[#141414] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-red-500">{{ r.season.year }}</p>
            <h1 class="text-xl font-bold text-white">{{ r.name }}</h1>
            <p class="mt-1 text-sm text-gray-400">{{ r.circuit }}</p>
          </div>

          <div class="flex gap-6">
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-500">Date</p>
              <p class="text-sm font-medium text-white">{{ r.date }}</p>
            </div>
          </div>
        </div>

        @if (onlyMine) {
          <app-auth-gate message="Sign up to see your ratings.">
            @if (r.driverRaceResults.length) {
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

                            <span class="text-xs text-white/50">
                              {{ result.driverSeason.team.name }}
                            </span>
                          </div>

                          @if (result.context != '') {
                            <button
                              type="button"
                              class="mt-1.5 flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
                              (click)="toggleContext(result.id)"
                            >
                              <span class="inline-flex transition-transform" [class.rotate-90]="contextOpen[result.id]">
                                <app-icon name="chevron-right" [size]="12" />
                              </span>

                              Context
                            </button>
                          }
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
                        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-[#252525]">
                          <div
                            class="h-full rounded-full bg-[#ff1f1f]"
                            [style.width.%]="driverScore(result.driverSeason.id) * 10"
                          ></div>
                        </div>
                        <span
                          class="w-12 shrink-0 text-right text-3xl font-black leading-none"
                          [class]="scoreColorClass(driverScore(result.driverSeason.id))"
                        >
                          {{ driverScore(result.driverSeason.id).toFixed(1) }}
                        </span>
                      </div>
                    </div>

                    @if (contextOpen[result.id]) {
                      <p class="mt-2 text-xs leading-relaxed text-gray-400">
                        {{ result.context }}
                      </p>
                    }
                  </div>
                }
              </div>
            } @else {
              <p class="py-8 text-center text-sm text-gray-500">No ratings available for this race yet.</p>
            }
          </app-auth-gate>
        } @else {
          @if (r.driverRaceResults.length) {
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

                          <span class="text-xs text-white/50">
                            {{ result.driverSeason.team.name }}
                          </span>
                        </div>

                        @if (result.context != '') {
                          <button
                            type="button"
                            class="mt-1.5 flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
                            (click)="toggleContext(result.id)"
                          >
                            <span class="inline-flex transition-transform" [class.rotate-90]="contextOpen[result.id]">
                              <app-icon name="chevron-right" [size]="12" />
                            </span>

                            Context
                          </button>
                        }
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
                      <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-[#252525]">
                        <div
                          class="h-full rounded-full bg-[#ff1f1f]"
                          [style.width.%]="driverScore(result.driverSeason.id) * 10"
                        ></div>
                      </div>
                      <span
                        class="w-12 shrink-0 text-right text-3xl font-black leading-none"
                        [class]="scoreColorClass(driverScore(result.driverSeason.id))"
                      >
                        {{ driverScore(result.driverSeason.id).toFixed(1) }}
                      </span>
                    </div>
                  </div>

                  @if (contextOpen[result.id]) {
                    <p class="mt-2 text-xs leading-relaxed text-gray-400">
                      {{ result.context }}
                    </p>
                  }
                </div>
              }
            </div>
          } @else {
            <p class="py-8 text-center text-sm text-gray-500">No ratings available for this race yet.</p>
          }
        }
      }
    }
  `,
})
export class RacesPageComponent implements OnInit {
  private racesService = inject(RacesService);
  private ratingsService = inject(RatingsService);
  private seasonsService = inject(SeasonsService);
  authService = inject(AuthService);

  loading = signal(true);
  races = signal<RaceSummaryDTO[]>([]);
  years = signal<SeasonSummaryDTO[]>([]);
  selectedRace = signal<RaceResponseDTO | null>(null);

  selectedYear: string | '2026' = '2026';
  selectedRaceId: string | null = null;
  onlyMine = false;

  contextOpen: Record<string, boolean> = {};

  private ratingsByDriverSeason: Record<string, number> = {};
  ratings: DriverSeasonRating[] = [];

  ngOnInit(): void {
    this.loading.set(true);

    forkJoin({
      races: this.racesService.getAllByYear(parseInt(this.selectedYear)),
      years: this.seasonsService.getAll(),
      currentRace: this.racesService.getCurrent().pipe(catchError(() => of(null))),
    }).subscribe({
      next: ({ races, years, currentRace }) => {
        this.races.set(races);
        this.years.set(years);

        const raceId = currentRace?.id ?? races[0]?.id;

        if (!raceId) {
          this.loading.set(false);
          return;
        }

        if (currentRace) {
          this.selectedYear = currentRace.season.year.toString();
        }

        this.loadRaceAndRatings(raceId);
      },
      error: () => this.loading.set(false),
    });
  }

  private loadRaceAndRatings(raceId: string): void {
    this.loading.set(true);

    const race$ = this.racesService.getById(raceId);

    const ratings$ =
      this.onlyMine && !this.authService.isAuthenticated()
        ? of([] as DriverSeasonRating[])
        : this.onlyMine
          ? this.ratingsService.getUserRatings(+this.selectedYear, raceId)
          : this.ratingsService.getGlobalRatings(+this.selectedYear, raceId);

    forkJoin({ race: race$, ratings: ratings$ }).subscribe({
      next: ({ race, ratings }) => {
        this.selectedRaceId = race.id;
        this.ratings = ratings;

        this.ratingsByDriverSeason = Object.fromEntries(
          ratings.map((rating) => [rating.driverSeasonId, rating.averageRating])
        );

        const ratingOrder = new Map(
          ratings.map((rating, index) => [rating.driverSeasonId, index])
        );

        const sortedResults = [...race.driverRaceResults].sort(
          (a, b) =>
            (ratingOrder.get(a.driverSeason.id) ?? Infinity) -
            (ratingOrder.get(b.driverSeason.id) ?? Infinity)
        );

        this.selectedRace.set({
          ...race,
          driverRaceResults: sortedResults
        });

        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onRaceChange(): void {
    if (this.selectedRaceId) {
      this.loadRaceAndRatings(this.selectedRaceId);
    }
  }

  toggleOnlyMine(): void {
    this.onlyMine = !this.onlyMine;

    if (this.selectedRaceId) {
      this.loadRaceAndRatings(this.selectedRaceId);
    }
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

  driverScore(driverSeasonId: string): number {
    return this.ratingsByDriverSeason[driverSeasonId] ?? 0;
  }

  scoreColorClass(score: number): string {
    if (score == 10) return 'text-[#00BFFF]';
    if (score >= 8) return 'text-emerald-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  }
}