import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DriverSeasonRating, RaceRatingCreationDTO } from '../models/rating.model';

@Injectable({ providedIn: 'root' })
export class RatingsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/rating`;

  submitRatings(request: RaceRatingCreationDTO): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/race`, request);
  }

  updateRatings(request: RaceRatingCreationDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/race/update`, request);
  }

  getUserRaceRatings(raceId: string): Observable<DriverSeasonRating[]> {
    return this.http.get<DriverSeasonRating[]>(`${this.baseUrl}/race/user/${raceId}`);
  }
}