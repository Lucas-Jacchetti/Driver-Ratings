import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TeamCreationDTO, TeamResponseDTO } from '../models/team.model';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/team`;

  getAll(): Observable<TeamResponseDTO[]> {
    return this.http.get<TeamResponseDTO[]>(this.baseUrl);
  }

  getById(id: string): Observable<TeamResponseDTO> {
    return this.http.get<TeamResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(dto: TeamCreationDTO): Observable<TeamResponseDTO> {
    return this.http.post<TeamResponseDTO>(this.baseUrl, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
