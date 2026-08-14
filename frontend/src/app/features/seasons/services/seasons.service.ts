import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SeasonResponseDTO } from '../models/season.model';
import { DriverSeasonCreationDTO, DriverSeasonSummaryDTO } from '../models/driver-season.model';

@Injectable({ providedIn: 'root' })
export class SeasonsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/seasons`;

  getAll(): Observable<SeasonResponseDTO[]> {
    return this.http.get<SeasonResponseDTO[]>(this.baseUrl);
  }

  getById(id: string): Observable<SeasonResponseDTO> {
    return this.http.get<SeasonResponseDTO>(`${this.baseUrl}/${id}`);
  }

  addDriverSeason(dto: DriverSeasonCreationDTO): Observable<DriverSeasonSummaryDTO> {
    return this.http.post<DriverSeasonSummaryDTO>(`${environment.apiUrl}/driverseasons`, dto);
  }
}
