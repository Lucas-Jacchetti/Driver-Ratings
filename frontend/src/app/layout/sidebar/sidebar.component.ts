import { Component } from '@angular/core';

// Placeholder -- útil quando a área de admin crescer (cadastro de corrida,
// resultado em lote, etc.) e precisar de navegação própria, separada da navbar pública.
@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `<aside class="w-56 shrink-0"><!-- navegação de admin aqui --></aside>`,
})
export class SidebarComponent {}
