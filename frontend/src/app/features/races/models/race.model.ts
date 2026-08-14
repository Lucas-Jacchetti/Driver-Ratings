import { DriverRaceResultSummaryDTO } from './driver-race-result.model';
import { SeasonSummaryDTO } from '../../seasons/models/season.model';

export interface RaceSummaryDTO {
  id: string;
  name: string;
  circuit: string;
  date: string; // ISO 8601 UTC -- converter pro fuso local só na exibição
}

export interface RaceResponseDTO {
  id: string;
  name: string;
  circuit: string;
  date: string;
  season: SeasonSummaryDTO;
  driverRaceResults: DriverRaceResultSummaryDTO[];
}

export interface RaceCreationDTO {
  name: string;
  circuit: string;
  date: string;
  seasonId: string;
}
