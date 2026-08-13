import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunitiesService } from '../../services/communities.service';
import { CommunityResponseDTO } from '../../models/community.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-communities-page',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <h1 class="text-xl font-bold mb-4">Comunidades</h1>
    @if (loading) {
      <app-loading-spinner />
    } @else {
      <ul class="divide-y divide-gray-800">
        @for (community of communities; track community.id) {
          <li class="py-2">{{ community.name }}</li>
        }
      </ul>
    }
  `,
})
export class CommunitiesPageComponent implements OnInit {
  private communitiesService = inject(CommunitiesService);
  communities: CommunityResponseDTO[] = [];
  loading = true;

  ngOnInit(): void {
    this.communitiesService.getAll().subscribe((communities) => {
      this.communities = communities;
      this.loading = false;
    });
  }
}
