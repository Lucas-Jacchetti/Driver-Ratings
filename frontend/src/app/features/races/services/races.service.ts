import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RaceCreationDTO, RaceResponseDTO, RaceSummaryDTO } from '../models/race.model';
import { DriverRaceResultSubmissionRequest } from '../models/driver-race-result.model';

@Injectable({ providedIn: 'root' })
export class RacesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/race`;

  getAll(): Observable<RaceSummaryDTO[]> {
    return this.http.get<RaceSummaryDTO[]>(this.baseUrl);
  }

  getById(id: string): Observable<RaceResponseDTO> {
    return this.http.get<RaceResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(dto: RaceCreationDTO): Observable<RaceResponseDTO> {
    return this.http.post<RaceResponseDTO>(this.baseUrl, dto);
  }

  submitResults(request: DriverRaceResultSubmissionRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/driverraceresult/bulk`, request);
  }

  getCurrent(): Observable<RaceResponseDTO> {
  return this.http.get<RaceResponseDTO>(`${this.baseUrl}/current`);
}
}
