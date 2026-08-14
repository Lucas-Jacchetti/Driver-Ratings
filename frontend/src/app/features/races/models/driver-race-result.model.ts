import { DriverSeasonSummaryDTO } from '../../seasons/models/driver-season.model';
import { RaceSummaryDTO } from './race.model';
import { RatingSummaryDTO } from '../../ratings/models/rating.model';

export interface DriverRaceResultSummaryDTO {
  id: string;
  driverSeason: DriverSeasonSummaryDTO;
  race: RaceSummaryDTO;
  startingPosition: number;
  finishingPosition: number; // 0 = DNF/DNS
  context: string;
}

export interface DriverRaceResultResponseDTO extends DriverRaceResultSummaryDTO {
  ratings: RatingSummaryDTO[];
}

export interface DriverRaceResultUpdateDTO {
  driverRaceResultId: string;
  startingPosition: number;
  finishingPosition: number;
  context: string;
}

export interface DriverRaceResultSubmissionRequest {
  results: DriverRaceResultUpdateDTO[];
}
