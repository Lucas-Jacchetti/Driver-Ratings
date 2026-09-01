import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon.component';
import { CommunitiesService } from '../../services/communities.service';
import { CommunityResponseDTO, PagedResult } from '../../models/community.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';

type ViewMode = 'All' | 'Mine';

@Component({
  selector: 'app-communities-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="mb-1 flex items-start justify-between gap-4">
      <h1 class="text-xl font-bold text-white">Communities</h1>
      <button type="button" class="app-button-primary" (click)="openJoinModal()">
        <app-icon name="link" [size]="15" />
        Join with Code
      </button>
    </div>
    <p class="mb-5 text-sm text-gray-500">Find and join communities</p>

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
        @for (mode of viewModes; track mode) {
          <button
            type="button"
            class="rounded px-3 py-1.5 text-xs font-medium"
            [class.bg-red-600]="activeView === mode"
            [class.text-white]="activeView === mode"
            [class.text-gray-400]="activeView !== mode"
            (click)="setView(mode)"
          >
            {{ mode }}
          </button>
        }
      </div>
    </div>

    @if (loading) {
      <p class="text-sm text-gray-500">Loading communities...</p>
    } @else if (filteredCommunities.length === 0) {
      <p class="text-sm text-gray-500">No communities found.</p>
    } @else {
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        @for (community of filteredCommunities; track community.id) {
          <div class="overflow-hidden rounded-lg border border-gray-800 bg-[#141414]">
            @if (community.imgUrl) {
              <div class="relative h-32">
                <img
                  [src]="community.imgUrl"
                  [alt]="community.name"
                  referrerpolicy="no-referrer"
                  class="h-full w-full object-cover"
                />
                <span class="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-xs font-medium text-gray-200">
                  {{ community.isPublic ? 'Public' : 'Private' }}
                </span>
              </div>
            } @else {
              <div class="relative h-32 bg-gradient-to-br from-slate-700 to-slate-950">
                <span class="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-xs font-medium text-gray-200">
                  {{ community.isPublic ? 'Public' : 'Private' }}
                </span>
              </div>
            }
            <div class="p-4">
              <h3 class="mb-1 font-bold text-white">{{ community.name }}</h3>
              <p class="mb-3 line-clamp-2 text-sm text-gray-400">
                {{ community.description }}
              </p>
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-1.5 text-xs text-gray-500">
                  <app-icon name="users" [size]="14" />
                  {{ community.members.length }} members
                </span>
                @if (activeView === 'All') {
                  <button
                    type="button"
                    class="px-4 py-1.5 text-xs"
                    [class.app-button-primary]="!isMember(community)"
                    [class.app-button-secondary]="isMember(community)"
                    [disabled]="isMember(community)"
                    (click)="joinCommunity(community)"
                  >
                    {{ isMember(community) ? 'Already In' : 'Join' }}
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>
    }

    @if (showJoinModal) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" (click)="closeJoinModal()">
        <div class="w-full max-w-sm rounded-lg bg-[#141414] p-6" (click)="$event.stopPropagation()">
          @if (!foundCommunity) {
            <h2 class="mb-1 text-lg font-bold text-white">Enter Code</h2>
            <p class="mb-4 text-sm text-gray-500">Enter the private community code to find it.</p>
            <input
              type="text"
              class="app-input mb-2"
              placeholder="Ex: F1BR-2024-XYZ"
              [(ngModel)]="accessCode"
              name="accessCode"
            />
            @if (codeError) {
              <p class="mb-3 text-xs text-red-500">{{ codeError }}</p>
            }
            <div class="flex gap-3">
              <button type="button" class="app-button-secondary flex-1" (click)="closeJoinModal()">
                Cancel
              </button>
              <button type="button" class="app-button-primary flex-1" (click)="searchByCode()">
                Search
              </button>
            </div>
          } @else {
            <h2 class="mb-1 text-lg font-bold text-white">{{ foundCommunity.name }}</h2>
            <p class="mb-4 text-sm text-gray-400">
              {{ foundCommunity.description }}
            </p>
            <div class="flex gap-3">
              <button type="button" class="app-button-secondary flex-1" (click)="closeJoinModal()">
                Cancel
              </button>
              <button
                type="button"
                class="app-button-primary flex-1"
                [disabled]="isMember(foundCommunity)"
                (click)="joinCommunity(foundCommunity, accessCode)"
              >
                {{ isMember(foundCommunity) ? 'Already In' : 'Enter' }}
              </button>
            </div>
          }
        </div>
      </div>
    }

    @if (toastMessage) {
      <div class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
        {{ toastMessage }}
      </div>
    }
  `,
})
export class CommunitiesPageComponent implements OnInit {
  private communitiesService = inject(CommunitiesService);
  private authService = inject(AuthService);

  communities: CommunityResponseDTO[] = [];
  loading = true;

  viewModes: ViewMode[] = ['All', 'Mine'];
  activeView: ViewMode = 'All';
  search = '';

  showJoinModal = false;
  accessCode = '';
  codeError = '';
  foundCommunity: CommunityResponseDTO | null = null;

  toastMessage = '';
  private toastTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.loadCommunities();
  }

  setView(mode: ViewMode): void {
    this.activeView = mode;
    this.loadCommunities();
  }

  loadCommunities(): void {
    this.loading = true;
    const request$: Observable<CommunityResponseDTO[] | PagedResult<CommunityResponseDTO>> =
      this.activeView === 'Mine'
        ? this.communitiesService.getMy()
        : this.communitiesService.getAll();

    request$.subscribe({
      next: (result) => {
        this.communities = Array.isArray(result) ? result : result.items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  isMember(community: CommunityResponseDTO): boolean {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return false;
    return community.members.some((m) => m.user.id === userId);
  }

  joinCommunity(community: CommunityResponseDTO, accessToken?: string): void {
    this.communitiesService.createMember({ communityId: community.id, accessToken }).subscribe({
      next: () => {
        this.closeJoinModal();
        this.showToast(`You joined ${community.name}!`);
        this.loadCommunities();
      },
      error: () => {
        this.codeError = 'Failed to join community.';
      },
    });
  }

  openJoinModal(): void {
    this.showJoinModal = true;
  }

  closeJoinModal(): void {
    this.showJoinModal = false;
    this.accessCode = '';
    this.codeError = '';
    this.foundCommunity = null;
  }

  searchByCode(): void {
    this.codeError = '';
    this.communitiesService.getByCode(this.accessCode).subscribe({
      next: (community) => {
        this.foundCommunity = community;
      },
      error: () => {
        this.codeError = 'Invalid Code.';
      },
    });
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

  get filteredCommunities(): CommunityResponseDTO[] {
    return this.communities.filter((c) =>
      c.name.toLowerCase().includes(this.search.toLowerCase())
    );
  }
}