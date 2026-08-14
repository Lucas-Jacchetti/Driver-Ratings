import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RaceRatingCreationDTO } from '../models/rating.model';

@Injectable({ providedIn: 'root' })
export class RatingsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/ratings`;

  submitRatings(request: RaceRatingCreationDTO): Observable<void> {
    return this.http.post<void>(this.baseUrl, request);
  }
}
