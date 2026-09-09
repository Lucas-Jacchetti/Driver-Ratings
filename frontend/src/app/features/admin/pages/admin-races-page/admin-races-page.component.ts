import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';
import { RacesService } from '../../../races/services/races.service';
import { SeasonsService } from '../../../seasons/services/seasons.service';
import { RaceCreationDTO, RaceSummaryDTO } from '../../../races/models/race.model';
import { SeasonSummaryDTO } from '../../../seasons/models/season.model';
import { extractApiError } from '../../../../shared/utils/http-error';

interface RaceForm {
  name: string;
  circuit: string;
  flag: string;
  date: string;
  isSprint: boolean;
}

@Component({
  selector: 'app-admin-races-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, LoadingSpinnerComponent],
  template: `
    <h1 class="text-xl font-bold text-white">Admin · Races</h1>
    <p class="mb-5 text-sm text-gray-500">Create or remove races for a given season</p>

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
    </div>

    @if (!selectedSeasonId) {
      <p class="py-8 text-center text-sm text-gray-500">Create a season first.</p>
    } @else {
      <form
        (ngSubmit)="create()"
        class="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-gray-800 bg-[#141414] p-5"
      >
        <div class="min-w-[180px] flex-1">
          <label class="mb-1 block text-xs uppercase tracking-wide text-gray-500">Name</label>
          <input class="app-input" [(ngModel)]="form.name" name="name" placeholder="Brazilian GP" required />
        </div>
        <div class="min-w-[160px] flex-1">
          <label class="mb-1 block text-xs uppercase tracking-wide text-gray-500">Circuit</label>
          <input class="app-input" [(ngModel)]="form.circuit" name="circuit" placeholder="Interlagos" required />
        </div>
        <div class="w-24">
          <label class="mb-1 block text-xs uppercase tracking-wide text-gray-500">Flag</label>
          <input class="app-input" [(ngModel)]="form.flag" name="flag" placeholder="br" maxlength="2" required />
        </div>
        <div class="min-w-[190px]">
          <label class="mb-1 block text-xs uppercase tracking-wide text-gray-500">Date (UTC)</label>
          <input
            class="app-input text-white"
            type="datetime-local"
            [(ngModel)]="form.date"
            name="date"
            required
          />
        </div>
        <div class="flex items-center gap-2 pb-2.5">
          <input
            type="checkbox"
            id="isSprint"
            class="h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-gray-700 bg-[#141414] checked:border-red-600 checked:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 focus:ring-offset-0"
            [(ngModel)]="form.isSprint"
            name="isSprint"
          />
          <label for="isSprint" class="text-xs uppercase tracking-wide text-gray-500">Sprint</label>
        </div>
        <button type="submit" class="app-button-primary px-4 py-2" [disabled]="creating()">
          <app-icon name="plus" [size]="15" />
          Add
        </button>
      </form>

      @if (errorMessage()) {
        <p class="mb-4 text-sm text-red-400">{{ errorMessage() }}</p>
      }

      @if (loading()) {
        <app-loading-spinner />
      } @else {
        <div class="space-y-2">
          @for (race of races(); track race.id) {
            <div class="flex items-center justify-between rounded-lg border border-gray-800 bg-[#141414] px-5 py-3">
              <div class="flex items-center gap-3">
                <div class="flex h-5 w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm">
                  <img
                    [src]="flagUrl(race.flag)"
                    alt=""
                    class="h-full w-full object-cover"
                    onerror="this.style.display='none'"
                  />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-sm text-gray-200">{{ race.name }}</p>
                    @if (race.isSprint) {
                      <span class="rounded bg-red-950/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-400">
                        Sprint
                      </span>
                    }
                  </div>
                  <p class="text-xs text-gray-500">{{ race.circuit }} · {{ formatDate(race.date) }}</p>
                </div>
              </div>
              <button
                type="button"
                class="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-950/40 hover:text-red-500"
                (click)="delete(race.id)"
              >
                <app-icon name="trash" [size]="16" />
              </button>
            </div>
          } @empty {
            <p class="py-8 text-center text-sm text-gray-500">No races registered for this season yet.</p>
          }
        </div>
      }
    }
  `,
})
export class AdminRacesPageComponent implements OnInit {
  private racesService = inject(RacesService);
  private seasonsService = inject(SeasonsService);

  seasons = signal<SeasonSummaryDTO[]>([]);
  races = signal<RaceSummaryDTO[]>([]);
  loading = signal(true);
  creating = signal(false);
  errorMessage = signal('');

  selectedSeasonId = '';
  form: RaceForm = { name: '', circuit: '', flag: '', date: '', isSprint: false };

  ngOnInit(): void {
    this.seasonsService.getAll().subscribe({
      next: (seasons) => {
        const sorted = [...seasons].sort((a, b) => b.year - a.year);
        this.seasons.set(sorted);
        this.selectedSeasonId = sorted[0]?.id ?? '';
        this.loadRaces();
      },
      error: () => this.loading.set(false),
    });
  }

  onSeasonChange(): void {
    this.loadRaces();
  }

  private loadRaces(): void {
    if (!this.selectedSeasonId) {
      this.loading.set(false);
      return;
    }

    const season = this.seasons().find((s) => s.id === this.selectedSeasonId);
    if (!season) return;

    this.loading.set(true);
    this.racesService.getAllByYear(season.year).subscribe({
      next: (races) => {
        this.races.set([...races].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  create(): void {
    if (!this.form.name.trim() || !this.form.circuit.trim() || !this.form.flag.trim() || !this.form.date) return;

    const dto: RaceCreationDTO = {
      name: this.form.name,
      circuit: this.form.circuit,
      flag: this.form.flag.toLowerCase(),
      date: `${this.form.date}:00Z`,
      seasonId: this.selectedSeasonId,
      isSprint: this.form.isSprint,
    };

    this.creating.set(true);
    this.errorMessage.set('');

    this.racesService.create(dto).subscribe({
      next: () => {
        this.form = { name: '', circuit: '', flag: '', date: '', isSprint: false };
        this.creating.set(false);
        this.loadRaces();
      },
      error: (err) => {
        this.errorMessage.set(extractApiError(err, 'Could not create the race.'));
        this.creating.set(false);
      },
    });
  }

  delete(id: string): void {
    this.errorMessage.set('');

    this.racesService.delete(id).subscribe({
      next: () => this.loadRaces(),
      error: (err) => this.errorMessage.set(extractApiError(err, 'Could not delete this race.')),
    });
  }

  flagUrl(countryCode: string): string {
    return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
  }

  formatDate(date: string): string {
    return date;
  }
}