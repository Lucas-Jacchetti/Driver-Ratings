import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { IconComponent } from '../../../../shared/components/icon.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';
import { SeasonsService } from '../../../seasons/services/seasons.service';
import { DriversService } from '../../../drivers/services/drivers.service';
import { TeamsService } from '../../../../shared/services/teams.service';
import { DriverSeasonCreationDTO, DriverSeasonSummaryDTO } from '../../../seasons/models/driver-season.model';
import { SeasonSummaryDTO } from '../../../seasons/models/season.model';
import { DriverSummaryDTO } from '../../../drivers/models/driver.model';
import { TeamResponseDTO } from '../../../../shared/models/team.model';
import { extractApiError } from '../../../../shared/utils/http-error';

interface DriverSeasonForm {
  driverId: string;
  teamId: string;
  driverNumber: number | null;
}

@Component({
  selector: 'app-admin-driver-seasons-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, LoadingSpinnerComponent],
  template: `
    <h1 class="text-xl font-bold text-white">Admin · Driver-Seasons</h1>
    <p class="mb-5 text-sm text-gray-500">Link a driver to a team for a season (only changes between seasons)</p>

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
          <label class="mb-1 block text-xs uppercase tracking-wide text-gray-500">Driver</label>
          <select class="app-select" [(ngModel)]="form.driverId" name="driverId" required>
            <option value="" disabled>Select a driver</option>
            @for (driver of drivers(); track driver.id) {
              <option [value]="driver.id">{{ driver.name }}</option>
            }
          </select>
        </div>
        <div class="min-w-[180px] flex-1">
          <label class="mb-1 block text-xs uppercase tracking-wide text-gray-500">Team</label>
          <select class="app-select" [(ngModel)]="form.teamId" name="teamId" required>
            <option value="" disabled>Select a team</option>
            @for (team of teams(); track team.id) {
              <option [value]="team.id">{{ team.name }}</option>
            }
          </select>
        </div>
        <div class="w-28">
          <label class="mb-1 block text-xs uppercase tracking-wide text-gray-500">Number</label>
          <input
            class="app-input"
            type="number"
            min="0"
            max="99"
            [(ngModel)]="form.driverNumber"
            name="driverNumber"
            placeholder="1"
            required
          />
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
          @for (driverSeason of filteredDriverSeasons(); track driverSeason.id) {
            <div class="flex items-center justify-between rounded-lg border border-gray-800 bg-[#141414] px-5 py-3">
              <div class="flex items-center gap-3">
                <div class="flex h-5 w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm">
                  <img
                    [src]="flagUrl(driverSeason.driver.flag)"
                    alt=""
                    class="h-full w-full object-cover"
                    onerror="this.style.display='none'"
                  />
                </div>
                <div>
                  <p class="text-sm text-gray-200">{{ driverSeason.driver.name }}</p>
                  <p class="text-xs text-gray-500">{{ driverSeason.team.name }}</p>
                </div>
              </div>
              <button
                type="button"
                class="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-950/40 hover:text-red-500"
                (click)="delete(driverSeason.id)"
              >
                <app-icon name="trash" [size]="16" />
              </button>
            </div>
          } @empty {
            <p class="py-8 text-center text-sm text-gray-500">No drivers linked to this season yet.</p>
          }
        </div>
      }
    }
  `,
})
export class AdminDriverSeasonsPageComponent implements OnInit {
  private seasonsService = inject(SeasonsService);
  private driversService = inject(DriversService);
  private teamsService = inject(TeamsService);

  seasons = signal<SeasonSummaryDTO[]>([]);
  drivers = signal<DriverSummaryDTO[]>([]);
  teams = signal<TeamResponseDTO[]>([]);
  driverSeasons = signal<DriverSeasonSummaryDTO[]>([]);

  loading = signal(true);
  creating = signal(false);
  errorMessage = signal('');

  selectedSeasonId = '';
  form: DriverSeasonForm = { driverId: '', teamId: '', driverNumber: null };

  filteredDriverSeasons = computed(() =>
    this.driverSeasons()
      .filter((ds) => ds.season.id === this.selectedSeasonId)
      .sort((a, b) => a.driverNumber - b.driverNumber)
  );

  ngOnInit(): void {
    this.loading.set(true);

    forkJoin({
      seasons: this.seasonsService.getAll(),
      drivers: this.driversService.getAll(),
      teams: this.teamsService.getAll(),
      driverSeasons: this.seasonsService.getAllDriverSeasons(),
    }).subscribe({
      next: ({ seasons, drivers, teams, driverSeasons }) => {
        const sortedSeasons = [...seasons].sort((a, b) => b.year - a.year);
        this.seasons.set(sortedSeasons);
        this.drivers.set(drivers);
        this.teams.set(teams);
        this.driverSeasons.set(driverSeasons);
        this.selectedSeasonId = sortedSeasons[0]?.id ?? '';
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSeasonChange(): void {
    // A lista é filtrada em memória (computed), nao precisa recarregar do zero.
  }

  create(): void {
    if (!this.form.driverId || !this.form.teamId || this.form.driverNumber === null) return;

    const dto: DriverSeasonCreationDTO = {
      driverId: this.form.driverId,
      teamId: this.form.teamId,
      driverNumber: this.form.driverNumber,
      seasonId: this.selectedSeasonId,
    };

    this.creating.set(true);
    this.errorMessage.set('');

    this.seasonsService.addDriverSeason(dto).subscribe({
      next: () => {
        this.form = { driverId: '', teamId: '', driverNumber: null };
        this.creating.set(false);
        this.reloadDriverSeasons();
      },
      error: (err) => {
        this.errorMessage.set(extractApiError(err, 'Could not link the driver to the team.'));
        this.creating.set(false);
      },
    });
  }

  delete(id: string): void {
    this.errorMessage.set('');

    this.seasonsService.deleteDriverSeason(id).subscribe({
      next: () => this.reloadDriverSeasons(),
      error: (err) => this.errorMessage.set(extractApiError(err, 'Could not remove this link, this driver already has results associated with him.')),
    });
  }

  flagUrl(countryCode: string): string {
    return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
  }

  private reloadDriverSeasons(): void {
    this.seasonsService.getAllDriverSeasons().subscribe({
      next: (driverSeasons) => this.driverSeasons.set(driverSeasons),
    });
  }
}
