import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RacesService } from '../../services/races.service';
import { RaceResponseDTO } from '../../models/race.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-race-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    @if (loading) {
      <app-loading-spinner />
    } @else if (race) {
      <h1 class="text-xl font-bold text-white mb-1">{{ race.name }}</h1>
      <p class="text-gray-500 mb-4">{{ race.circuit }}</p>

      <a
        [routerLink]="['/races', race.id, 'rate']"
        class="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-md mb-6"
      >
        Avaliar pilotos
      </a>

      <div class="rounded-lg border border-gray-800 bg-[#141414] divide-y divide-gray-800">
        @for (result of race.driverRaceResults; track result.id) {
          <div class="py-3 px-5 flex justify-between text-sm">
            <span class="text-gray-200">{{ result.driverSeason.driver.name }} ({{ result.driverSeason.team.name }})</span>
            <span class="text-gray-500">P{{ result.startingPosition }} → P{{ result.finishingPosition }}</span>
          </div>
        }
      </div>
    }
  `,
})
export class RaceDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private racesService = inject(RacesService);

  race: RaceResponseDTO | null = null;
  loading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.racesService.getById(id).subscribe((race) => {
      this.race = race;
      this.loading = false;
    });
  }
}
