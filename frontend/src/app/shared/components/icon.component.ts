import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.width]="size"
      [attr.height]="size"
    >
      @switch (name) {
        @case ('home') {
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10v9h5v-5h2v5h5v-9" />
        }
        @case ('history') {
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        }
        @case ('calendar') {
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M4 10h16M8 3v4M16 3v4" />
        }
        @case ('users') {
          <circle cx="8.5" cy="8" r="3" />
          <path d="M2.5 19c0-3 2.6-5 6-5s6 2 6 5" />
          <circle cx="17" cy="9" r="2.4" />
          <path d="M21.5 19c0-2.2-1.6-3.9-4-4.5" />
        }
        @case ('user') {
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
        }
        @case ('settings') {
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 13.5a7.3 7.3 0 0 0 0-3l2-1.4-2-3.5-2.3.8a7.2 7.2 0 0 0-2.6-1.5L14 2h-4l-.5 2.4a7.2 7.2 0 0 0-2.6 1.5l-2.3-.8-2 3.5 2 1.4a7.3 7.3 0 0 0 0 3l-2 1.5 2 3.5 2.3-.9c.8.6 1.7 1.1 2.6 1.4L10 22h4l.5-2.4a7.2 7.2 0 0 0 2.6-1.4l2.3.9 2-3.5-2-1.5Z"
          />
        }
        @case ('menu') {
          <path d="M4 6h16M4 12h16M4 18h16" />
        }
        @case ('search') {
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        }
        @case ('link') {
          <path d="m9 15 6-6" />
          <path d="M13 5.5 15 3.5a3.5 3.5 0 0 1 5 5L18 10.5" />
          <path d="M11 18.5 9 20.5a3.5 3.5 0 0 1-5-5L6 13.5" />
        }
        @case ('chevron-down') {
          <path d="m6 9 6 6 6-6" />
        }
        @case ('chevron-right') {
          <path d="m9 6 6 6-6 6" />
        }
        @case ('x') {
          <path d="m6 6 12 12M18 6 6 18" />
        }
        @case ('bell') {
          <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        }
        @case ('moon') {
          <path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z" />
        }
        @case ('eye') {
          <path d="M2 12S5.5 5.5 12 5.5 22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.6" />
        }
        @case ('key') {
          <circle cx="7.5" cy="14.5" r="3.3" />
          <path d="m10 12 7.5-7.5M15 4.5l2 2M13 6.5l2 2" />
        }
        @case ('edit') {
          <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
          <path d="m13 6.5 3 3" />
        }
        @case ('logout') {
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
        }
        @case ('trophy') {
          <path d="M8 3.5h8v4.5a4 4 0 0 1-8 0V3.5Z" />
          <path d="M8 4.5H5.2A2.8 2.8 0 0 0 8 8M16 4.5h2.8A2.8 2.8 0 0 1 16 8" />
          <path d="M10.5 14.5h3v3h-3z" />
          <path d="M8 20.5h8" />
        }
        @case ('plus') {
          <path d="M12 5v14M5 12h14" />
        }
      }
    </svg>
  `,
})
export class IconComponent {
  @Input() name = '';
  @Input() size = 18;
}
