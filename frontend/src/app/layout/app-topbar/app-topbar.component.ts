import { Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { IconComponent } from '../../shared/components/icon.component';
import { AuthService } from '../../features/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [IconComponent],
  template: `
    <header class="flex items-center justify-between border-b border-gray-800 bg-[#111111] px-4 py-4 sm:px-6">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="rounded-md p-1.5 text-gray-400 hover:bg-[#141414] hover:text-white lg:hidden"
          (click)="menuClick.emit()"
        >
          <app-icon name="menu" [size]="20" />
        </button>
        <div>
          @if (authService.isAuthenticated()) {
            <p class="text-sm font-semibold text-white sm:text-base">Hello, {{ firstName() }}!</p>
            <p class="text-xs text-gray-500 sm:text-sm">Keep up and rate the drivers for the current race.</p>
          }
          @else {
            <p class="text-sm font-semibold text-white sm:text-base">Hello!</p>
            <p class="text-xs text-gray-500 sm:text-sm">Sign in and rate the drivers for the current race.</p>
          }
        </div>
      </div>

      @if (authService.isAuthenticated()) {
        <button
          type="button"
          class="mr-2 flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-400 min-[450px]:gap-2 min-[450px]:text-sm sm:mr-4"
          (click)="logout()"
        >
          <app-icon name="logout" [size]="20" class="min-[450px]:hidden" />
          <app-icon name="logout" [size]="16" class="hidden min-[450px]:block" />
          <span class="hidden min-[450px]:inline">Log out</span>
        </button>
      }
    </header>
  `,
})
export class AppTopbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  userName = computed(() => this.authService.currentUser()?.name);

  firstName = computed(() => this.userName()?.split(' ')[0]);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  @Output() menuClick = new EventEmitter<void>();
}