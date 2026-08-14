import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../shared/components/icon.component';
import { AuthService } from '../../features/auth/services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-gray-800 bg-[#111111] transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0"
      [class.-translate-x-full]="!open"
      [class.translate-x-0]="open"
    >
      <div class="flex items-center gap-2 px-5 py-5">
        <div class="flex h-8 w-8 items-center justify-center rounded bg-red-600 text-sm font-bold text-white">DR</div>
        <span class="text-sm font-bold tracking-wide text-white">DRIVER RATINGS</span>
      </div>

      <nav class="flex-1 space-y-1 px-3">
        @for (item of navItems; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-red-950/40 text-red-500"
            [routerLinkActiveOptions]="{ exact: !!item.exact }"
            class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-[#141414] hover:text-gray-100"
            (click)="close()"
          >
            <app-icon [name]="item.icon" [size]="18" />
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="mt-auto flex items-center gap-3 border-t border-gray-800 bg-[#141414] px-4 py-4">
        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='32' fill='%23e10600'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dominant-baseline='middle' font-size='26' font-family='Arial, sans-serif' font-weight='700' fill='white'%3EL%3C/text%3E%3C/svg%3E"
          alt="Avatar do usuário"
          class="h-9 w-9 shrink-0 rounded-full object-cover"
        />
        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-white">{{ userName }}</p>
          <p class="truncate text-xs text-gray-500">{{ userEmail }}</p>
        </div>
      </div>
    </aside>

    @if (open) {
      <div class="fixed inset-0 z-30 bg-black/60 lg:hidden" (click)="close()"></div>
    }
  `,
})
export class AppSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  // Mock -- substituir por dado real do usuário logado quando integrar.
  userName = 'Lucas';
  userEmail = 'lucas@email.com';
  userInitial = 'L';

  navItems: NavItem[] = [
    { label: 'Início', path: '/', icon: 'home', exact: true },
    { label: 'Corridas', path: '/races', icon: 'history' },
    { label: 'Temporada', path: '/seasons', icon: 'calendar' },
    { label: 'Comunidade', path: '/communities', icon: 'users' },
    { label: 'Perfil', path: '/profile', icon: 'user' },
    { label: 'Configurações', path: '/settings', icon: 'settings' },
  ];

  close(): void {
    this.openChange.emit(false);
  }
}
