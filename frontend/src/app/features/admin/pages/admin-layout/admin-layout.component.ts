import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex flex-col gap-6 sm:flex-row sm:gap-8">
      <app-sidebar />
      <div class="min-w-0 flex-1">
        <router-outlet />
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {}
