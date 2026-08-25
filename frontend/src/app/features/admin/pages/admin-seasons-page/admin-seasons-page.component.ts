import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';
import { SeasonsService } from '../../../seasons/services/seasons.service';
import { SeasonCreationDTO, SeasonResponseDTO } from '../../../seasons/models/season.model';
import { extractApiError } from '../../../../shared/utils/http-error';

@Component({
  selector: 'app-admin-seasons-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, LoadingSpinnerComponent],
  template: `
    <h1 class="text-xl font-bold text-white">Admin · Seasons</h1>
    <p class="mb-5 text-sm text-gray-500">Create or remove seasons available in the API</p>

    <form
      (ngSubmit)="create()"
      class="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-gray-800 bg-[#141414] p-5"
    >
      <div class="w-32">
        <label class="mb-1 block text-xs uppercase tracking-wide text-gray-500">Year</label>
        <input
          class="app-input"
          type="number"
          [(ngModel)]="form.year"
          name="year"
          placeholder="2026"
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
        @for (season of seasons(); track season.id) {
          <div class="flex items-center justify-between rounded-lg border border-gray-800 bg-[#141414] px-5 py-3">
            <div>
              <span class="text-sm font-semibold text-white">{{ season.year }}</span>
              <span class="ml-2 text-xs text-gray-500">
                {{ season.races.length }} race(s) · {{ season.driverSeasons.length }} driver-season(s)
              </span>
            </div>
            <button
              type="button"
              class="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-950/40 hover:text-red-500"
              (click)="delete(season.id)"
            >
              <app-icon name="trash" [size]="16" />
            </button>
          </div>
        } @empty {
          <p class="py-8 text-center text-sm text-gray-500">No seasons registered yet.</p>
        }
      </div>
    }
  `,
})
export class AdminSeasonsPageComponent implements OnInit {
  private seasonsService = inject(SeasonsService);

  seasons = signal<SeasonResponseDTO[]>([]);
  loading = signal(true);
  creating = signal(false);
  errorMessage = signal('');

  form: SeasonCreationDTO = { year: new Date().getFullYear() };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.seasonsService.getAll().subscribe({
      next: (seasons) => {
        this.seasons.set([...seasons].sort((a, b) => b.year - a.year));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  create(): void {
    if (!this.form.year) return;

    this.creating.set(true);
    this.errorMessage.set('');

    this.seasonsService.create(this.form).subscribe({
      next: () => {
        this.form = { year: new Date().getFullYear() };
        this.creating.set(false);
        this.load();
      },
      error: (err) => {
        this.errorMessage.set(extractApiError(err, 'Could not create the season.'));
        this.creating.set(false);
      },
    });
  }

  delete(id: string): void {
    this.errorMessage.set('');

    this.seasonsService.delete(id).subscribe({
      next: () => this.load(),
      error: (err) => this.errorMessage.set(extractApiError(err, 'Could not delete this season.')),
    });
  }
}
