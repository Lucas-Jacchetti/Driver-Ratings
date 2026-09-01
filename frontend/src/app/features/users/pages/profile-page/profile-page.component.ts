import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { IconComponent } from "../../../../shared/components/icon.component";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <h1 class="text-xl font-bold text-white mb-5">Profile</h1>

    <div class="mb-6 flex items-center gap-4 rounded-lg border border-gray-800 bg-[#141414] p-5">
      <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-600 text-xl font-semibold text-white">
        {{ user.initial }}
      </div>
      <div>
        <p class="text-lg font-bold text-white">{{ user.name }}</p>
        <p class="text-sm text-gray-500">{{ user.email }}</p>
        <p class="text-xs text-gray-600">Joined at {{ user.memberSince }}</p>
      </div>
    </div>
    <div class="rounded-lg border border-gray-800 bg-[#141414]">
    <button
      type="button"
      class="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-red-500 hover:text-red-400"
      (click)="logout()"
    >
      <app-icon name="logout" [size]="16" />
      Log out
    </button>
  </div>
  `,
})
export class ProfilePageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  get user() {
    const currentUser = this.authService.currentUser();
    return {
      initial: currentUser?.name.charAt(0).toUpperCase() ?? '?',
      name: currentUser?.name ?? 'User',
      email: currentUser?.email ?? '',
      memberSince: currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : '',
    };
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
