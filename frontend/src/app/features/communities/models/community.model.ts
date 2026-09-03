import { UserSummaryDTO } from '../../../shared/models/user.model';

export interface CommunityResponseDTO {
  id: string;
  name: string;
  accessCode: string | null;
  description: string;
  host: UserSummaryDTO;
  isPublic: boolean;
  imgUrl: string | null;
  members: CommunityMemberResponseDTO[];
  createdAt: string;
}

export interface CommunityCreationDTO {
  name: string;
  description: string;
  isPublic: boolean;
  imgUrl: string | null;
}

export interface CommunityMemberCreationDTO {
  communityId: string;
  accessToken?: string | null;
}

export interface CommunityMemberResponseDTO{
    id: string,
    communityId: string,
    community: string,
    user: UserSummaryDTO,
    joinedAt: string
}

export interface CommunityUpdateRequest{
    name?: string,
    description?: string,
    isPublic?: boolean,
    imgUrl?: string
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
