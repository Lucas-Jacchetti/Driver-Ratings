import { RaceSummaryDTO } from '../../races/models/race.model';
import { DriverSeasonSummaryDTO } from './driver-season.model';

export interface SeasonSummaryDTO {
  id: string;
  year: number;
}

export interface SeasonResponseDTO {
  id: string;
  year: number;
  races: RaceSummaryDTO[];
  driverSeasons: DriverSeasonSummaryDTO[];
}
