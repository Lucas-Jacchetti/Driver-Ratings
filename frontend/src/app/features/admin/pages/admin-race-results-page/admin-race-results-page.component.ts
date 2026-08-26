import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';
import { RacesService } from '../../../races/services/races.service';
import { SeasonsService } from '../../../seasons/services/seasons.service';
import { RaceSummaryDTO } from '../../../races/models/race.model';
import { DriverRaceResultSummaryDTO, DriverRaceResultSubmissionRequest, } from '../../../races/models/driver-race-result.model';
import { SeasonSummaryDTO } from '../../../seasons/models/season.model';
import { extractApiError } from '../../../../shared/utils/http-error';

@Component({
  selector: 'app-admin-race-results-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <h1 class="text-xl font-bold text-white">Admin · Race Results</h1>

    <p class="mb-5 text-sm text-gray-500">
      Update the results of a completed race
    </p>

    <div class="mb-5 flex flex-wrap items-center gap-3">
      <select
        class="app-select w-40"
        [(ngModel)]="selectedSeasonId"
        name="season"
        (ngModelChange)="onSeasonChange()"
      >
        @for (season of seasons(); track season.id) {
          <option [value]="season.id">{{ season.year }}</option>
        }
      </select>

      <select
        class="app-select w-56"
        [(ngModel)]="selectedRaceId"
        name="race"
        (ngModelChange)="onRaceChange()"
      >
        <option value="" disabled>Select a race</option>

        @for (race of races(); track race.id) {
          <option [value]="race.id">{{ race.name }}</option>
        }
      </select>
    </div>

    @if (errorMessage()) {
      <p class="mb-4 text-sm text-red-400">
        {{ errorMessage() }}
      </p>
    }

    @if (loading()) {
      <app-loading-spinner />
    } @else if (!selectedRaceId) {
      <p class="py-8 text-center text-sm text-gray-500">
        Select a race to manage its results.
      </p>
    } @else {
      <div class="space-y-2">
        @for (result of results(); track result.id) {
          <div class="rounded-lg border border-gray-800 bg-[#141414] px-5 py-4">
            <div class="mb-3 flex items-center gap-3">
              <div
                class="flex h-5 w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm"
              >
                <img
                  [src]="flagUrl(result.driverSeason.driver.flag)"
                  alt=""
                  class="h-full w-full object-cover"
                  onerror="*this*.style.display='none'"
                />
              </div>

              <span class="text-sm font-medium text-gray-200">
                {{ result.driverSeason.driver.name }}
              </span>
            </div>

            <div class="flex flex-wrap items-end gap-3">
              <div class="w-28">
                <label
                  class="mb-1 block text-xs uppercase tracking-wide text-gray-500"
                >
                  Started
                </label>

                <input
                  class="app-input"
                  type="number"
                  min="0"
                  max="99"
                  [(ngModel)]="result.startingPosition"
                  [name]="'starting-' + result.id"
                />
              </div>

              <div class="w-28">
                <label
                  class="mb-1 block text-xs uppercase tracking-wide text-gray-500"
                >
                  Finished
                </label>

                <input
                  class="app-input"
                  type="number"
                  min="0"
                  max="99"
                  [(ngModel)]="result.finishingPosition"
                  [name]="'finishing-' + result.id"
                />
              </div>

              <div class="min-w-[220px] flex-1">
                <label
                  class="mb-1 block text-xs uppercase tracking-wide text-gray-500"
                >
                  Context
                </label>

                <input
                  class="app-input"
                  [(ngModel)]="result.context"
                  [name]="'context-' + result.id"
                  placeholder="Crashed on lap 12"
                />
              </div>
            </div>
          </div>
        } @empty {
          <p class="py-8 text-center text-sm text-gray-500">
            No driver results were generated for this race.
          </p>
        }
      </div>

      @if (results().length) {
        <div class="mt-5 flex items-center justify-end gap-4">
          @if (saved()) {
            <span class="text-sm text-green-400">
              Results saved successfully.
            </span>
          }

          <button
            type="button"
            class="app-button-primary px-4 py-2"
            [disabled]="saving()"
            (click)="save()"
          >
            {{ saving() ? 'Saving...' : 'Save Results' }}
          </button>
        </div>
      }
    }
  `,
})
export class AdminRaceResultsPageComponent implements OnInit {
  private racesService = inject(RacesService);
  private seasonsService = inject(SeasonsService);

  seasons = signal<SeasonSummaryDTO[]>([]);
  races = signal<RaceSummaryDTO[]>([]);
  results = signal<DriverRaceResultSummaryDTO[]>([]);

  loading = signal(true);
  saving = signal(false);
  saved = signal(false);
  errorMessage = signal('');

  selectedSeasonId = '';
  selectedRaceId = '';

  ngOnInit(): void {
    this.seasonsService.getAll().subscribe({
      next: seasons => {
        const sorted = [...seasons].sort((a, b) => b.year - a.year);

        this.seasons.set(sorted);
        this.selectedSeasonId = sorted[0]?.id ?? '';
        this.loadRaces();
      },
      error: () => this.loading.set(false),
    });
  }

  onSeasonChange(): void {
    this.selectedRaceId = '';
    this.results.set([]);
    this.saved.set(false);
    this.loadRaces();
  }

  onRaceChange(): void {
    this.saved.set(false);
    this.loadResults();
  }

  private loadRaces(): void {
    const season = this.seasons().find(
      s => s.id === this.selectedSeasonId
    );

    if (!season) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.saved.set(false);

    this.racesService.getAllByYear(season.year).subscribe({
      next: races => {
        this.races.set(
          [...races].sort(
            (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        );

        this.selectedRaceId = this.races()[0]?.id ?? '';

        if (this.selectedRaceId) {
          this.loadResults();
        } else {
          this.loading.set(false);
        }
      },
      error: err => {
        this.errorMessage.set(
          extractApiError(err, 'Could not load races.')
        );
        this.loading.set(false);
      },
    });
  }

  private loadResults(): void {
    if (!this.selectedRaceId) return;

    this.loading.set(true);
    this.errorMessage.set('');
    this.saved.set(false);

    this.racesService
      .getRaceResultsByRace(this.selectedRaceId)
      .subscribe({
        next: results => {
          this.results.set(
            [...results].sort(
              (a, b) =>
                a.driverSeason.driverNumber -
                b.driverSeason.driverNumber
            )
          );

          this.loading.set(false);
        },
        error: err => {
          this.errorMessage.set(
            extractApiError(err, 'Could not load race results.')
          );
          this.loading.set(false);
        },
      });
  }

  flagUrl(countryCode: string): string {
    return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
  }

  save(): void {
    if (!this.selectedRaceId || !this.results().length) return;

    this.saving.set(true);
    this.saved.set(false);
    this.errorMessage.set('');

    const request: DriverRaceResultSubmissionRequest = {
      results: this.results().map(result => ({
        driverRaceResultId: result.id,
        startingPosition: result.startingPosition,
        finishingPosition: result.finishingPosition,
        context: result.context ?? '',
      })),
    };

    this.racesService
      .submitResults(this.selectedRaceId, request)
      .subscribe({
        next: results => {
          this.results.set(
            [...results].sort(
              (a, b) =>
                a.driverSeason.driverNumber -
                b.driverSeason.driverNumber
            )
          );

          this.saving.set(false);
          this.saved.set(true);
        },
        error: err => {
          this.errorMessage.set(
            extractApiError(err, 'Could not save race results.')
          );
          this.saving.set(false);
          this.saved.set(false);
        },
      });
  }
}