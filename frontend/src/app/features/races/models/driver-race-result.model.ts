import { DriverSeasonSummaryDTO } from '../../seasons/models/driver-season.model';
import { RaceSummaryDTO } from './race.model';
import { RatingSummaryDTO } from '../../ratings/models/rating.model';

export interface DriverRaceResultSummaryDTO {
  id: string;
  driverSeason: DriverSeasonSummaryDTO;
  race: RaceSummaryDTO;
  startingPosition: number;
  finishingPosition: number; // 0 = DNF/DNS
  startingPositionSprint: number;
  finishingPositionSprint: number;
  context: string;
}

export interface DriverRaceResultResponseDTO extends DriverRaceResultSummaryDTO {
  ratings: RatingSummaryDTO[];
}

export interface DriverRaceResultCreationDTO {
  driverSeasonId: string;
  raceId: string;
  startingPosition: number;
  finishingPosition: number;
  startingPositionSprint: number;
  finishingPositionSprint: number;
  context: string;
}

export interface DriverRaceResultUpdateDTO {
  driverRaceResultId: string;
  startingPosition: number;
  finishingPosition: number;
  startingPositionSprint: number;
  finishingPositionSprint: number;
  context: string;
}

export interface DriverRaceResultSubmissionRequest {
  results: DriverRaceResultUpdateDTO[];
}
