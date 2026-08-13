import { UserSummaryDTO } from '../../../shared/models/user.model';

export interface CommunityResponseDTO {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  host: UserSummaryDTO;
  createdAt: string;
}

export interface CommunityCreationDTO {
  name: string;
  description: string | null;
  isPublic: boolean;
}

export interface JoinCommunityRequest {
  communityId?: string;
  accessCode?: string;
}
