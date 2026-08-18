import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  DriverSeasonRating,
  RaceRatingCreationDTO
} from '../models/rating.model';

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

  getGlobalRatings(year: number, raceId?: string): Observable<DriverSeasonRating[]> {
    let params = new HttpParams().set('year', year);

    if (raceId) {
      params = params.set('raceId', raceId);
    }

    return this.http.get<DriverSeasonRating[]>(
      `${this.baseUrl}/global`,
      { params }
    );
  }

  getUserRatings(year: number,raceId?: string): Observable<DriverSeasonRating[]> {
    let params = new HttpParams().set('year', year);

    if (raceId) {
      params = params.set('raceId', raceId);
    }

    return this.http.get<DriverSeasonRating[]>(
      `${this.baseUrl}/user`,
      { params }
    );
  }
}