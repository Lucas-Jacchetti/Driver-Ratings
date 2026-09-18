import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HomePageComponent } from './home-page.component';
import { AuthService } from '../../../auth/services/auth.service';
import { environment } from '../../../../../environments/environment';
import { RaceResponseDTO } from '../../../races/models/race.model';
import { DriverRaceResultSummaryDTO } from '../../../races/models/driver-race-result.model';
import { DriverSeasonRating } from '../../../ratings/models/rating.model';

describe('HomePageComponent (integration)', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let component: HomePageComponent;
  let httpMock: HttpTestingController;
  let isAuthenticated: ReturnType<typeof signal<boolean>>;

  const raceUrl = `${environment.apiUrl}/race/current`;
  const ratingUrl = `${environment.apiUrl}/rating`;

  function driverResult(
    id: string,
    teamName: string,
    driverNumber: number,
    overrides: Partial<DriverRaceResultSummaryDTO> = {}
  ): DriverRaceResultSummaryDTO {
    return {
      id,
      driverSeason: {
        id: `ds-${id}`,
        driverNumber,
        driver: { id: `d-${id}`, name: `Driver ${id}`, flag: 'br' },
        team: { id: `t-${teamName}`, name: teamName },
        season: { id: 's1', year: 2026 },
      },
      race: { id: 'r1', name: 'Race', circuit: 'C', flag: 'br', date: '2026-01-01T00:00:00Z', isSprint: false },
      startingPosition: driverNumber,
      finishingPosition: driverNumber,
      startingPositionSprint: 0,
      finishingPositionSprint: 0,
      context: '',
      ...overrides,
    };
  }

  function currentRace(results: DriverRaceResultSummaryDTO[], isSprint = false): RaceResponseDTO {
    return {
      id: 'r1',
      name: 'Brazilian GP',
      circuit: 'Interlagos',
      flag: 'br',
      date: '2026-11-08T14:00:00Z',
      season: { id: 's1', year: 2026 },
      driverRaceResults: results,
      isSprint,
    };
  }

  beforeEach(async () => {
    isAuthenticated = signal(false);

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { isAuthenticated } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads the current race, sorts drivers by team order then driver number, and defaults scores to 5', () => {
    fixture.detectChanges();

    const results = [
      driverResult('a', 'Ferrari', 2),
      driverResult('b', 'McLaren', 1),
      driverResult('c', 'McLaren', 4),
    ];
    httpMock.expectOne(raceUrl).flush(currentRace(results));

    // McLaren comes before Ferrari in TEAM_ORDER; within McLaren, #1 before #4.
    expect(component.race()?.driverRaceResults.map((r) => r.id)).toEqual(['b', 'c', 'a']);
    expect(component.scores['a']).toBe(5);
    expect(component.scores['b']).toBe(5);
    expect(component.loading()).toBe(false);
  });

  it('stops loading when the current-race request fails', () => {
    fixture.detectChanges();
    httpMock.expectOne(raceUrl).flush('err', { status: 500, statusText: 'Server Error' });

    expect(component.loading()).toBe(false);
  });

  it('does not request user ratings when unauthenticated', () => {
    isAuthenticated.set(false);
    fixture.detectChanges();
    httpMock.expectOne(raceUrl).flush(currentRace([driverResult('a', 'Ferrari', 1)]));

    httpMock.expectNone((req) => req.url.startsWith(`${ratingUrl}/user`));
    expect(component.alreadyRated()).toBe(false);
  });

  it('loads and applies existing user ratings when authenticated', () => {
    isAuthenticated.set(true);
    fixture.detectChanges();

    const result = driverResult('a', 'Ferrari', 1);
    httpMock.expectOne(raceUrl).flush(currentRace([result]));

    const userRatings: DriverSeasonRating[] = [
      {
        driverSeasonId: result.driverSeason.id,
        driverName: 'Driver a',
        driverFlag: 'br',
        teamName: 'Ferrari',
        averageRating: 8.5,
      },
    ];
    httpMock.expectOne((r) => r.url === `${ratingUrl}/user`).flush(userRatings);

    expect(component.alreadyRated()).toBe(true);
    expect(component.scores['a']).toBe(8.5);
  });

  it('leaves alreadyRated false when the user has no existing ratings', () => {
    isAuthenticated.set(true);
    fixture.detectChanges();

    httpMock.expectOne(raceUrl).flush(currentRace([driverResult('a', 'Ferrari', 1)]));
    httpMock.expectOne((r) => r.url === `${ratingUrl}/user`).flush([]);

    expect(component.alreadyRated()).toBe(false);
  });

  describe('pure helpers', () => {
    beforeEach(() => {
      fixture.detectChanges();
      httpMock.expectOne(raceUrl).flush(currentRace([]));
    });

    it('isEditable() is true before rating and false after, unless editing', () => {
      expect(component.isEditable()).toBe(true);
      component.alreadyRated.set(true);
      expect(component.isEditable()).toBe(false);
      component.editing.set(true);
      expect(component.isEditable()).toBe(true);
    });

    it('toggleContext() flips the open state for a result', () => {
      expect(component.contextOpen['x']).toBeUndefined();
      component.toggleContext('x');
      expect(component.contextOpen['x']).toBe(true);
      component.toggleContext('x');
      expect(component.contextOpen['x']).toBe(false);
    });

    it('teamColor() returns the known color or a gray fallback', () => {
      expect(component.teamColor('Ferrari')).toBe('#E8002D');
      expect(component.teamColor('Some Unknown Team')).toBe('#6b7280');
    });

    it('finishLabel() renders DNF for position 0, otherwise P<position>', () => {
      expect(component.finishLabel(0)).toBe('DNF');
      expect(component.finishLabel(3)).toBe('P3');
    });

    it('scoreColorClass() buckets by score', () => {
      expect(component.scoreColorClass(9)).toBe('text-emerald-400');
      expect(component.scoreColorClass(6)).toBe('text-yellow-400');
      expect(component.scoreColorClass(4)).toBe('text-orange-400');
      expect(component.scoreColorClass(1)).toBe('text-red-400');
      expect(component.scoreColorClass(undefined)).toBe('text-red-400');
    });

    it('trackBackground() builds a gradient string proportional to the score', () => {
      expect(component.trackBackground(5)).toBe(
        'linear-gradient(to right, #ff1f1f 0%, #ff1f1f 50%, #374151 50%, #374151 100%)'
      );
    });

    it('flagUrl() lowercases the country code', () => {
      expect(component.flagUrl('BR')).toBe('https://flagcdn.com/br.svg');
    });
  });

  it('startEditing()/cancelEditing() toggle editing and restore original scores', () => {
    isAuthenticated.set(true);
    fixture.detectChanges();

    const result = driverResult('a', 'Ferrari', 1);
    httpMock.expectOne(raceUrl).flush(currentRace([result]));
    httpMock
      .expectOne((r) => r.url === `${ratingUrl}/user`)
      .flush([
        { driverSeasonId: result.driverSeason.id, driverName: 'D', driverFlag: 'br', teamName: 'Ferrari', averageRating: 7 },
      ]);

    component.startEditing();
    expect(component.editing()).toBe(true);

    component.scores['a'] = 9.5;
    component.cancelEditing();

    expect(component.editing()).toBe(false);
    expect(component.scores['a']).toBe(7);
  });

  it('submit() posts ratings for scored drivers and marks alreadyRated on success', () => {
    fixture.detectChanges();
    const results = [driverResult('a', 'Ferrari', 1), driverResult('b', 'McLaren', 1)];
    httpMock.expectOne(raceUrl).flush(currentRace(results));

    component.scores['a'] = 7.5;
    component.scores['b'] = 6;

    component.submit();
    expect(component.saving()).toBe(true);

    const req = httpMock.expectOne(`${ratingUrl}/race`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      raceId: 'r1',
      ratings: [
        { driverRaceResultId: 'b', score: 6 },
        { driverRaceResultId: 'a', score: 7.5 },
      ],
    });
    req.flush(null);

    expect(component.saving()).toBe(false);
    expect(component.alreadyRated()).toBe(true);
    expect(component.feedback()).toBe('success');
    expect(component.feedbackMessage()).toBe('Ratings saved successfully.');
  });

  it('submit() sets error feedback when the request fails', () => {
    fixture.detectChanges();
    httpMock.expectOne(raceUrl).flush(currentRace([driverResult('a', 'Ferrari', 1)]));

    component.scores['a'] = 5;
    component.submit();

    httpMock.expectOne(`${ratingUrl}/race`).flush('err', { status: 500, statusText: 'Server Error' });

    expect(component.feedback()).toBe('error');
    expect(component.feedbackMessage()).toBe('Failed to save ratings.');
    expect(component.saving()).toBe(false);
  });

  it('submit() is a no-op while already saving or without a loaded race', () => {
    fixture.detectChanges();
    httpMock.expectOne(raceUrl).flush(currentRace([driverResult('a', 'Ferrari', 1)]));

    component.saving.set(true);
    component.submit();

    httpMock.expectNone((req) => req.url === `${ratingUrl}/race`);
  });

  it('update() puts ratings and turns editing off on success', () => {
    fixture.detectChanges();
    httpMock.expectOne(raceUrl).flush(currentRace([driverResult('a', 'Ferrari', 1)]));

    component.editing.set(true);
    component.scores['a'] = 8;
    component.update();

    const req = httpMock.expectOne(`${ratingUrl}/race/update`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);

    expect(component.editing()).toBe(false);
    expect(component.feedback()).toBe('success');
    expect(component.feedbackMessage()).toBe('Ratings updated successfully.');
  });

  it('update() sets error feedback when the request fails', () => {
    fixture.detectChanges();
    httpMock.expectOne(raceUrl).flush(currentRace([driverResult('a', 'Ferrari', 1)]));

    component.editing.set(true);
    component.scores['a'] = 8;
    component.update();

    httpMock.expectOne(`${ratingUrl}/race/update`).flush('err', { status: 500, statusText: 'Server Error' });

    expect(component.feedback()).toBe('error');
    expect(component.feedbackMessage()).toBe('Failed to update ratings.');
  });
});
