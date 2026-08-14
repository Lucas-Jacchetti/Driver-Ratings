import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RacesService } from '../../../races/services/races.service';
import { RatingsService } from '../../services/ratings.service';
import { RaceResponseDTO } from '../../../races/models/race.model';
import { RatingCreationDTO } from '../../models/rating.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-rate-race-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    @if (loading) {
      <app-loading-spinner />
    } @else if (race) {
      <h1 class="text-xl font-bold text-white mb-4">Avaliar -- {{ race.name }}</h1>

      <div class="space-y-2">
        @for (result of race.driverRaceResults; track result.id) {
          <div class="flex items-center justify-between rounded-lg border border-gray-800 bg-[#141414] px-5 py-3">
            <span class="text-sm text-gray-200">{{ result.driverSeason.driver.name }}</span>
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              class="app-input w-20 px-2 py-1 text-right"
              [(ngModel)]="scores[result.id]"
              name="score-{{ result.id }}"
            />
          </div>
        }
      </div>

      <div class="mt-6 flex justify-end">
        <button
          class="app-button-primary px-5 py-2.5"
          (click)="submit()"
        >
          Enviar avaliações
        </button>
      </div>
    }
  `,
})
export class RateRacePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private racesService = inject(RacesService);
  private ratingsService = inject(RatingsService);

  race: RaceResponseDTO | null = null;
  loading = true;
  scores: Record<string, number> = {};

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.racesService.getById(id).subscribe((race) => {
      this.race = race;
      this.loading = false;
    });
  }

  submit(): void {
    if (!this.race) return;

    const ratings: RatingCreationDTO[] = this.race.driverRaceResults
      .filter((r) => this.scores[r.id] != null)
      .map((r) => ({ driverRaceResultId: r.id, score: this.scores[r.id] }));

    this.ratingsService.submitRatings({ raceId: this.race.id, ratings }).subscribe();
  }
}
