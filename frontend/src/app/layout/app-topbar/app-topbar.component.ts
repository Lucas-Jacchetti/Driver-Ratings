import { Component, EventEmitter, Output } from '@angular/core';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [IconComponent],
  template: `
    <header class="flex items-center justify-between border-b border-gray-800 px-4 py-4 sm:px-6">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="rounded-md p-1.5 text-gray-400 hover:bg-gray-900 hover:text-white lg:hidden"
          (click)="menuClick.emit()"
        >
          <app-icon name="menu" [size]="20" />
        </button>
        <div>
          <p class="text-sm font-semibold text-white sm:text-base">Olá, {{ userName }}!</p>
          <p class="text-xs text-gray-500 sm:text-sm">Acompanhe e avalie os pilotos da corrida atual.</p>
        </div>
      </div>

      <span class="shrink-0 rounded bg-red-950 px-2.5 py-1 text-xs font-bold text-red-400">{{ seasonLabel }}</span>
    </header>
  `,
})
export class AppTopbarComponent {
  // Mock -- vem do usuário logado / temporada ativa quando integrar.
  userName = 'Lucas';
  seasonLabel = 'F1 2024';

  @Output() menuClick = new EventEmitter<void>();
}
