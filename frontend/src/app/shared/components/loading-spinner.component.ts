import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex justify-center items-center py-8">
      <div class="h-8 w-8 border-2 border-gray-600 border-t-red-500 rounded-full animate-spin"></div>
    </div>
  `,
})
export class LoadingSpinnerComponent {}
