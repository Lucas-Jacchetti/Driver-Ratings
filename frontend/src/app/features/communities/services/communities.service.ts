import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CommunityCreationDTO, CommunityMemberCreationDTO, CommunityResponseDTO, PagedResult } from '../models/community.model';

@Injectable({ providedIn: 'root' })
export class CommunitiesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/community`;
  private memberUrl = `${environment.apiUrl}/communitymember`;

  getAll(page = 1, pageSize = 20): Observable<PagedResult<CommunityResponseDTO>> {
    return this.http.get<PagedResult<CommunityResponseDTO>>(this.baseUrl, {
      params: { page, pageSize },
    });
  }

  create(dto: CommunityCreationDTO): Observable<CommunityResponseDTO> {
    return this.http.post<CommunityResponseDTO>(this.baseUrl, dto);
  }

  createMember(dto: CommunityMemberCreationDTO): Observable<void> {
    return this.http.post<void>(this.memberUrl, dto);
  }
  
  getMy(): Observable<CommunityResponseDTO[]> {
    return this.http.get<CommunityResponseDTO[]>(`${this.baseUrl}/my`);
  }

  getByCode(accessCode: string): Observable<CommunityResponseDTO> {
    return this.http.get<CommunityResponseDTO>(`${this.baseUrl}/by-code/${accessCode}`);
  }
}
