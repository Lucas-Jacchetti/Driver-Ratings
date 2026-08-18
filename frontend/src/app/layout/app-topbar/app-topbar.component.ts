import { Component, EventEmitter, Output } from '@angular/core';
import { IconComponent } from '../../shared/components/icon.component';

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
          <p class="text-sm font-semibold text-white sm:text-base">Hello, {{ userName }}!</p>
          <p class="text-xs text-gray-500 sm:text-sm">Keep up and rate the drivers for the current race.</p>
        </div>
      </div>

    </header>
  `,
})
export class AppTopbarComponent {
  userName = 'Lucas';

  @Output() menuClick = new EventEmitter<void>();
}
