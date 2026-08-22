import { DriverSeasonSummaryDTO } from '../../seasons/models/driver-season.model';

export interface DriverSummaryDTO {
  id: string;
  name: string;
  flag: string;
}

export interface DriverResponseDTO {
  id: string;
  name: string;
  driverSeasons: DriverSeasonSummaryDTO[];
}
