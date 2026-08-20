import { UserSummaryDTO } from '../../../shared/models/user.model';

export interface RatingSummaryDTO {
  id: string;
  user: UserSummaryDTO;
  score: number;
  ratedAt: string;
}

export interface RatingCreationDTO {
  driverRaceResultId: string;
  score: number;
}

export interface RaceRatingCreationDTO {
  raceId: string;
  ratings: RatingCreationDTO[];
}

export interface DriverSeasonRating {
  driverSeasonId: string;
  driverName: string;
  teamName: string;
  averageRating: number;
}
