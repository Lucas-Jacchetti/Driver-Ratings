import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';
import { TeamsService } from '../../../../shared/services/teams.service';
import { TeamCreationDTO, TeamResponseDTO } from '../../../../shared/models/team.model';
import { extractApiError } from '../../../../shared/utils/http-error';

@Component({
  selector: 'app-admin-teams-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, LoadingSpinnerComponent],
  template: `
    <h1 class="text-xl font-bold text-white">Admin · Teams</h1>
    <p class="mb-5 text-sm text-gray-500">Create or remove teams available in the API</p>

    <form
      (ngSubmit)="create()"
      class="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-gray-800 bg-[#141414] p-5"
    >
      <div class="min-w-[220px] flex-1">
        <label class="mb-1 block text-xs uppercase tracking-wide text-gray-500">Name</label>
        <input class="app-input" [(ngModel)]="form.name" name="name" placeholder="Ferrari" required />
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
        @for (team of teams(); track team.id) {
          <div class="flex items-center justify-between rounded-lg border border-gray-800 bg-[#141414] px-5 py-3">
            <span class="text-sm text-gray-200">{{ team.name }}</span>
            <button
              type="button"
              class="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-950/40 hover:text-red-500"
              (click)="delete(team.id)"
            >
              <app-icon name="trash" [size]="16" />
            </button>
          </div>
        } @empty {
          <p class="py-8 text-center text-sm text-gray-500">No teams registered yet.</p>
        }
      </div>
    }
  `,
})
export class AdminTeamsPageComponent implements OnInit {
  private teamsService = inject(TeamsService);

  teams = signal<TeamResponseDTO[]>([]);
  loading = signal(true);
  creating = signal(false);
  errorMessage = signal('');

  form: TeamCreationDTO = { name: '' };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.teamsService.getAll().subscribe({
      next: (teams) => {
        this.teams.set(teams);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  create(): void {
    if (!this.form.name.trim()) return;

    this.creating.set(true);
    this.errorMessage.set('');

    this.teamsService.create(this.form).subscribe({
      next: () => {
        this.form = { name: '' };
        this.creating.set(false);
        this.load();
      },
      error: (err) => {
        this.errorMessage.set(extractApiError(err, 'Could not create the team.'));
        this.creating.set(false);
      },
    });
  }

  delete(id: string): void {
    this.errorMessage.set('');

    this.teamsService.delete(id).subscribe({
      next: () => this.load(),
      error: (err) => this.errorMessage.set(extractApiError(err, 'Could not delete this team.')),
    });
  }
}
