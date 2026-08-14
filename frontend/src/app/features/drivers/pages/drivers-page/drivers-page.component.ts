import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversService } from '../../services/drivers.service';
import { DriverResponseDTO } from '../../models/driver.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-drivers-page',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <h1 class="text-xl font-bold mb-4">Pilotos</h1>
    @if (loading) {
      <app-loading-spinner />
    } @else {
      <ul class="divide-y divide-gray-800">
        @for (driver of drivers; track driver.id) {
          <li class="py-2">{{ driver.name }}</li>
        }
      </ul>
    }
  `,
})
export class DriversPageComponent implements OnInit {
  private driversService = inject(DriversService);
  drivers: DriverResponseDTO[] = [];
  loading = true;

  ngOnInit(): void {
    this.driversService.getAll().subscribe((drivers) => {
      this.drivers = drivers;
      this.loading = false;
    });
  }
}
