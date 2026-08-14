import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon.component';

type CommunityTag = 'Geral' | 'Piloto' | 'Equipe' | 'Análise';

interface MockCommunity {
  id: string;
  name: string;
  description: string;
  tag: CommunityTag;
  members: number;
  gradient: string;
}

// Dado mockado só pra popular a tela -- quando integrar, isso vira uma
// chamada a CommunitiesService.getAll().
const MOCK_COMMUNITIES: MockCommunity[] = [
  {
    id: 'f1-brasil-oficial',
    name: 'F1 Brasil Oficial',
    description: 'A maior comunidade de F1 do Brasil. Debates, análises e avaliações de cada corrida da temporada.',
    tag: 'Geral',
    members: 12840,
    gradient: 'from-slate-700 to-slate-950',
  },
  {
    id: 'torcida-verstappen',
    name: 'Torcida Verstappen',
    description: 'Para os fãs do campeão holandês. Análises de corrida e avaliações exclusivas.',
    tag: 'Piloto',
    members: 8420,
    gradient: 'from-blue-800 to-slate-950',
  },
  {
    id: 'ferrari-tifosi-br',
    name: 'Ferrari Tifosi BR',
    description: 'A paixão pela Scuderia Ferrari em solo brasileiro. Avalie os pilotos da Ferrari com a gente.',
    tag: 'Equipe',
    members: 6310,
    gradient: 'from-red-800 to-slate-950',
  },
  {
    id: 'analistas-de-grid',
    name: 'Analistas de Grid',
    description: 'Discussões técnicas profundas. Focamos em dados, estratégias e avaliações fundamentadas.',
    tag: 'Análise',
    members: 3180,
    gradient: 'from-zinc-700 to-zinc-950',
  },
  {
    id: 'mclaren-papaya',
    name: 'McLaren Papaya',
    description: 'Fãs de Norris e Piastri no Brasil. Acompanhe a ascensão da McLaren com a comunidade.',
    tag: 'Equipe',
    members: 2750,
    gradient: 'from-orange-700 to-slate-950',
  },
  {
    id: 'lewis-hamilton-fas',
    name: 'Lewis Hamilton Fãs',
    description: 'A comunidade do 7x campeão mundial. Avalie as corridas de Hamilton e debata seu legado.',
    tag: 'Piloto',
    members: 5900,
    gradient: 'from-teal-800 to-slate-950',
  },
];

const TABS: Array<CommunityTag | 'Todos'> = ['Todos', 'Geral', 'Piloto', 'Equipe', 'Análise'];

@Component({
  selector: 'app-communities-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="mb-1 flex items-start justify-between gap-4">
      <h1 class="text-xl font-bold text-white">Comunidade</h1>
      <button
        type="button"
        class="app-button-primary"
        (click)="showJoinModal = true"
      >
        <app-icon name="link" [size]="15" />
        Inserir Código
      </button>
    </div>
    <p class="mb-5 text-sm text-gray-500">Encontre e participe de comunidades de avaliação</p>

    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-md">
        <app-icon name="search" [size]="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          class="app-input pl-9 pr-3"
          placeholder="Buscar comunidades..."
          [(ngModel)]="search"
          name="search"
        />
      </div>

      <div class="flex flex-wrap gap-1 rounded-md bg-[#141414] p-1">
        @for (tab of tabs; track tab) {
          <button
            type="button"
            class="rounded px-3 py-1.5 text-xs font-medium"
            [class.bg-red-600]="activeTab === tab"
            [class.text-white]="activeTab === tab"
            [class.text-gray-400]="activeTab !== tab"
            (click)="activeTab = tab"
          >
            {{ tab }}
          </button>
        }
      </div>
    </div>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      @for (community of filteredCommunities; track community.id) {
        <div class="overflow-hidden rounded-lg border border-gray-800 bg-[#141414]">
          <div class="relative h-32 bg-gradient-to-br" [ngClass]="['bg-gradient-to-br', community.gradient]">
            <span class="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-xs font-medium text-gray-200">
              {{ community.tag }}
            </span>
          </div>
          <div class="p-4">
            <h3 class="mb-1 font-bold text-white">{{ community.name }}</h3>
            <p class="mb-3 line-clamp-2 text-sm text-gray-400">{{ community.description }}</p>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-xs text-gray-500">
                <app-icon name="users" [size]="14" />
                {{ community.members | number: '1.0-0' : 'pt-BR' }} membros
              </span>
              <button type="button" class="app-button-primary px-4 py-1.5 text-xs">
                Entrar
              </button>
            </div>
          </div>
        </div>
      }
    </div>

    @if (showJoinModal) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" (click)="showJoinModal = false">
        <div class="w-full max-w-sm rounded-lg bg-[#141414] p-6" (click)="$event.stopPropagation()">
          <h2 class="mb-1 text-lg font-bold text-white">Inserir Código</h2>
          <p class="mb-4 text-sm text-gray-500">Digite o código da comunidade para entrar.</p>
          <input
            type="text"
            class="app-input mb-5"
            placeholder="Ex: F1BR-2024-XYZ"
            [(ngModel)]="accessCode"
            name="accessCode"
          />
          <div class="flex gap-3">
            <button
              type="button"
              class="app-button-secondary flex-1"
              (click)="showJoinModal = false"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="app-button-primary flex-1"
              (click)="showJoinModal = false"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class CommunitiesPageComponent {
  communities = MOCK_COMMUNITIES;
  tabs = TABS;
  activeTab: CommunityTag | 'Todos' = 'Todos';
  search = '';

  showJoinModal = false;
  accessCode = '';

  get filteredCommunities(): MockCommunity[] {
    return this.communities.filter((c) => {
      const matchesTab = this.activeTab === 'Todos' || c.tag === this.activeTab;
      const matchesSearch = c.name.toLowerCase().includes(this.search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }
}
