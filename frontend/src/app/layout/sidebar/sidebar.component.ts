import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../shared/components/icon.component';

interface AdminNavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `
    <aside class="w-56 shrink-0">
      <p class="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Admin</p>
      <nav class="space-y-1">
        @for (item of navItems; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-red-950/40 text-red-500"
            class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-[#141414] hover:text-gray-100"
          >
            <app-icon [name]="item.icon" [size]="16" />
            {{ item.label }}
          </a>
        }
      </nav>
    </aside>
  `,
})
export class SidebarComponent {
  navItems: AdminNavItem[] = [
    { label: 'Drivers', path: '/admin/drivers', icon: 'user' },
    { label: 'Teams', path: '/admin/teams', icon: 'users' },
    { label: 'Seasons', path: '/admin/seasons', icon: 'calendar' },
    { label: 'Races', path: '/admin/races', icon: 'trophy' },
    { label: 'Driver-Seasons', path: '/admin/driver-seasons', icon: 'link' },
    { label: 'Race Results', path: '/admin/race-results', icon: 'edit' },
  ];
}
