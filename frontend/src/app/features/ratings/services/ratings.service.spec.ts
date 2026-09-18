import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RatingsService } from './ratings.service';
import { environment } from '../../../../environments/environment';
import { DriverSeasonRating, RaceRatingCreationDTO } from '../models/rating.model';

describe('RatingsService', () => {
  let service: RatingsService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/rating`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RatingsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(RatingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('submitRatings() POSTs to /rating/race', () => {
    const request: RaceRatingCreationDTO = { raceId: 'r1', ratings: [] };

    service.submitRatings(request).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/race`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(null);
  });

  it('updateRatings() PUTs to /rating/race/update', () => {
    const request: RaceRatingCreationDTO = { raceId: 'r1', ratings: [] };

    service.updateRatings(request).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/race/update`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(null);
  });

  it('getGlobalRatings() GETs /rating/global with only the year param when raceId is omitted', () => {
    const mock: DriverSeasonRating[] = [];

    service.getGlobalRatings(2026).subscribe((res) => expect(res).toEqual(mock));

    const req = httpMock.expectOne(
      (r) => r.url === `${baseUrl}/global` && r.params.get('year') === '2026'
    );
    expect(req.request.params.has('raceId')).toBe(false);
    req.flush(mock);
  });

  it('getGlobalRatings() includes raceId when provided', () => {
    service.getGlobalRatings(2026, 'race-9').subscribe();

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${baseUrl}/global` &&
        r.params.get('year') === '2026' &&
        r.params.get('raceId') === 'race-9'
    );
    req.flush([]);
  });

  it('getUserRatings() GETs /rating/user with the year param', () => {
    service.getUserRatings(2026).subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === `${baseUrl}/user` && r.params.get('year') === '2026'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getCommunityRatings() GETs /rating/community/:communityId with year and optional raceId', () => {
    service.getCommunityRatings(2026, 'community-1', 'race-9').subscribe();

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${baseUrl}/community/community-1` &&
        r.params.get('year') === '2026' &&
        r.params.get('raceId') === 'race-9'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
