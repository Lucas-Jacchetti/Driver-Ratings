import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CommunityCreationDTO, CommunityResponseDTO, JoinCommunityRequest } from '../models/community.model';

@Injectable({ providedIn: 'root' })
export class CommunitiesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/communities`;

  getAll(): Observable<CommunityResponseDTO[]> {
    return this.http.get<CommunityResponseDTO[]>(this.baseUrl);
  }

  create(dto: CommunityCreationDTO): Observable<CommunityResponseDTO> {
    return this.http.post<CommunityResponseDTO>(this.baseUrl, dto);
  }

  join(request: JoinCommunityRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/join`, request);
  }
}
