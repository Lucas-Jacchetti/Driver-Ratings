import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SeasonCreationDTO, SeasonResponseDTO } from '../models/season.model';
import { DriverSeasonCreationDTO, DriverSeasonSummaryDTO } from '../models/driver-season.model';

@Injectable({ providedIn: 'root' })
export class SeasonsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/season`;
  private driverSeasonUrl = `${environment.apiUrl}/driverseason`;

  getAll(): Observable<SeasonResponseDTO[]> {
    return this.http.get<SeasonResponseDTO[]>(this.baseUrl);
  }

  getById(id: string): Observable<SeasonResponseDTO> {
    return this.http.get<SeasonResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(dto: SeasonCreationDTO): Observable<SeasonResponseDTO> {
    return this.http.post<SeasonResponseDTO>(this.baseUrl, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  addDriverSeason(dto: DriverSeasonCreationDTO): Observable<DriverSeasonSummaryDTO> {
    return this.http.post<DriverSeasonSummaryDTO>(this.driverSeasonUrl, dto);
  }

  getAllDriverSeasons(): Observable<DriverSeasonSummaryDTO[]> {
    return this.http.get<DriverSeasonSummaryDTO[]>(this.driverSeasonUrl);
  }

  deleteDriverSeason(id: string): Observable<void> {
    return this.http.delete<void>(`${this.driverSeasonUrl}/${id}`);
  }
}
