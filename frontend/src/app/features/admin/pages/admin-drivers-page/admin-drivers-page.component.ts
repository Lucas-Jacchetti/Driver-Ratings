import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';
import { DriversService } from '../../../drivers/services/drivers.service';
import { DriverCreationDTO, DriverResponseDTO } from '../../../drivers/models/driver.model';
import { extractApiError } from '../../../../shared/utils/http-error';

@Component({
  selector: 'app-admin-drivers-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, LoadingSpinnerComponent],
  template: `
    <h1 class="text-xl font-bold text-white">Admin · Drivers</h1>
    <p class="mb-5 text-sm text-gray-500">Create or remove drivers available in the API</p>

    <form
      (ngSubmit)="create()"
      class="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-gray-800 bg-[#141414] p-5"
    >
      <div class="min-w-[180px] flex-1">
        <label class="mb-1 block text-xs uppercase tracking-wide text-gray-500">Name</label>
        <input class="app-input" [(ngModel)]="form.name" name="name" placeholder="Max Verstappen" required />
      </div>
      <div class="w-28">
        <label class="mb-1 block text-xs uppercase tracking-wide text-gray-500">Flag</label>
        <input class="app-input" [(ngModel)]="form.flag" name="flag" placeholder="nl" maxlength="2" required />
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
        @for (driver of drivers(); track driver.id) {
          <div class="flex items-center justify-between rounded-lg border border-gray-800 bg-[#141414] px-5 py-3">
            <div class="flex items-center gap-3">
              <div class="flex h-5 w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm">
                <img
                  [src]="flagUrl(driver.flag)"
                  alt=""
                  class="h-full w-full object-cover"
                  onerror="this.style.display='none'"
                />
              </div>
              <span class="text-sm text-gray-200">{{ driver.name }}</span>
            </div>
            <button
              type="button"
              class="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-950/40 hover:text-red-500"
              (click)="delete(driver.id)"
            >
              <app-icon name="trash" [size]="16" />
            </button> 
          </div>
        } @empty {
          <p class="py-8 text-center text-sm text-gray-500">No drivers registered yet.</p>
        }
      </div>
    }
  `,
})
export class AdminDriversPageComponent implements OnInit {
  private driversService = inject(DriversService);

  drivers = signal<DriverResponseDTO[]>([]);
  loading = signal(true);
  creating = signal(false);
  errorMessage = signal('');

  form: DriverCreationDTO = { name: '', flag: '' };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.driversService.getAll().subscribe({
      next: (drivers) => {
        this.drivers.set(drivers);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  create(): void {
    if (!this.form.name.trim() || !this.form.flag.trim()) return;

    this.creating.set(true);
    this.errorMessage.set('');

    this.driversService.create({ ...this.form, flag: this.form.flag.toLowerCase() }).subscribe({
      next: () => {
        this.form = { name: '', flag: '' };
        this.creating.set(false);
        this.load();
      },
      error: (err) => {
        this.errorMessage.set(extractApiError(err, 'Could not create the driver.'));
        this.creating.set(false);
      },
    });
  }

  delete(id: string): void {
    this.errorMessage.set('');

    this.driversService.delete(id).subscribe({
      next: () => this.load(),
      error: (err) => this.errorMessage.set(extractApiError(err, 'Could not delete this driver.')),
    });
  }

  flagUrl(countryCode: string): string {
    return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
  }
}
