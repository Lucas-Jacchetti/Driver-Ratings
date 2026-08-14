import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AppSidebarComponent } from './layout/app-sidebar/app-sidebar.component';
import { AppTopbarComponent } from './layout/app-topbar/app-topbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppSidebarComponent, AppTopbarComponent],
  template: `
    @if (showShell()) {
      <div class="flex min-h-screen bg-black text-gray-100">
        <app-sidebar-nav [open]="sidebarOpen()" (openChange)="sidebarOpen.set($event)" />
        <div class="flex min-w-0 flex-1 flex-col">
          <app-topbar (menuClick)="sidebarOpen.set(true)" />
          <main class="flex-1 overflow-y-auto p-4 sm:p-6">
            <router-outlet />
          </main>
        </div>
      </div>
    } @else {
      <router-outlet />
    }
  `,
})
export class AppComponent {
  private router = inject(Router);

  sidebarOpen = signal(false);
  showShell = signal(true);

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      const event = e as NavigationEnd;
      this.showShell.set(!event.urlAfterRedirects.startsWith('/login'));
      this.sidebarOpen.set(false);
    });
  }
}
