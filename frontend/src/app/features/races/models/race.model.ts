import { DriverRaceResultSummaryDTO } from './driver-race-result.model';
import { SeasonSummaryDTO } from '../../seasons/models/season.model';

export interface RaceSummaryDTO {
  id: string;
  name: string;
  circuit: string;
  flag: string;
  date: string;
}

export interface RaceResponseDTO {
  id: string;
  name: string;
  circuit: string;
  flag: string;
  date: string;
  season: SeasonSummaryDTO;
  driverRaceResults: DriverRaceResultSummaryDTO[];
}

export interface RaceCreationDTO {
  name: string;
  circuit: string;
  flag: string;
  date: string;
  seasonId: string;
}
