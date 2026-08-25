import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  RaceCreationDTO,
  RaceResponseDTO,
  RaceSummaryDTO,
} from '../models/race.model';

import {
  DriverRaceResultSubmissionRequest,
  DriverRaceResultSummaryDTO,
} from '../models/driver-race-result.model';

@Injectable({ providedIn: 'root' })
export class RacesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/race`;
  private driverRaceResultUrl = `${environment.apiUrl}/driverraceresult`;

  getAll(): Observable<RaceSummaryDTO[]> {
    return this.http.get<RaceSummaryDTO[]>(this.baseUrl);
  }

  getById(id: string): Observable<RaceResponseDTO> {
    return this.http.get<RaceResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(dto: RaceCreationDTO): Observable<RaceResponseDTO> {
    return this.http.post<RaceResponseDTO>(this.baseUrl, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  submitResults(
    raceId: string,
    request: DriverRaceResultSubmissionRequest
  ): Observable<DriverRaceResultSummaryDTO[]> {
    return this.http.put<DriverRaceResultSummaryDTO[]>(
      `${this.driverRaceResultUrl}/race/${raceId}`,
      request
    );
  }

  getCurrent(): Observable<RaceResponseDTO> {
    return this.http.get<RaceResponseDTO>(`${this.baseUrl}/current`);
  }

  getAllByYear(year: number): Observable<RaceSummaryDTO[]> {
    return this.http.get<RaceSummaryDTO[]>(`${this.baseUrl}/year/${year}`);
  }

  getRaceResultsByRace(
    raceId: string
  ): Observable<DriverRaceResultSummaryDTO[]> {
    return this.http.get<DriverRaceResultSummaryDTO[]>(
      `${this.driverRaceResultUrl}/race/${raceId}`
    );
  }
}