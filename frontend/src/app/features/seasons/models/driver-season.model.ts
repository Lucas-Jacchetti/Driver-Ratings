import { DriverSummaryDTO } from '../../drivers/models/driver.model';
import { TeamResponseDTO } from '../../../shared/models/team.model';
import { SeasonSummaryDTO } from './season.model';

export interface DriverSeasonSummaryDTO {
  id: string;
  driverNumber: number;
  driver: DriverSummaryDTO;
  team: TeamResponseDTO;
  season: SeasonSummaryDTO;
}

export interface DriverSeasonCreationDTO {
  driverNumber: number;
  driverId: string;
  teamId: string;
  seasonId: string;
}
