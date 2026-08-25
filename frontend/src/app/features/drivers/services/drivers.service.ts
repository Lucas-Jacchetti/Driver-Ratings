import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DriverCreationDTO, DriverResponseDTO } from '../models/driver.model';

@Injectable({ providedIn: 'root' })
export class DriversService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/driver`;

  getAll(): Observable<DriverResponseDTO[]> {
    return this.http.get<DriverResponseDTO[]>(this.baseUrl);
  }

  getById(id: string): Observable<DriverResponseDTO> {
    return this.http.get<DriverResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(dto: DriverCreationDTO): Observable<DriverResponseDTO> {
    return this.http.post<DriverResponseDTO>(this.baseUrl, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
