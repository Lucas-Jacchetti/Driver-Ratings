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
      class="fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-gray-800 bg-black transition-transform duration-200 lg:static lg:translate-x-0"
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
            class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-gray-100"
            (click)="close()"
          >
            <app-icon [name]="item.icon" [size]="18" />
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="flex items-center gap-3 border-t border-gray-800 px-4 py-4">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white">
          {{ userInitial }}
        </div>
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
