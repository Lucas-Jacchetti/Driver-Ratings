import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RacesPageComponent } from './races-page.component';
import { AuthService } from '../../../auth/services/auth.service';
import { environment } from '../../../../../environments/environment';
import { RaceResponseDTO, RaceSummaryDTO } from '../../models/race.model';
import { SeasonSummaryDTO } from '../../../seasons/models/season.model';
import { DriverSeasonRating } from '../../../ratings/models/rating.model';
import { DriverRaceResultSummaryDTO } from '../../models/driver-race-result.model';

describe('RacesPageComponent (integration)', () => {
  let fixture: ComponentFixture<RacesPageComponent>;
  let component: RacesPageComponent;
  let httpMock: HttpTestingController;
  let isAuthenticated: ReturnType<typeof signal<boolean>>;

  const raceUrl = `${environment.apiUrl}/race`;
  const seasonUrl = `${environment.apiUrl}/season`;
  const ratingUrl = `${environment.apiUrl}/rating`;

  const raceSummary: RaceSummaryDTO = {
    id: 'r1',
    name: 'Brazilian GP',
    circuit: 'Interlagos',
    flag: 'br',
    date: '2026-11-08T14:00:00Z',
    isSprint: false,
  };
  const seasons: SeasonSummaryDTO[] = [{ id: 's1', year: 2026 }];

  function driverResult(
    id: string,
    driverSeasonId: string,
    overrides: Partial<DriverRaceResultSummaryDTO> = {}
  ): DriverRaceResultSummaryDTO {
    return {
      id,
      driverSeason: {
        id: driverSeasonId,
        driverNumber: 1,
        driver: { id: `d-${id}`, name: `Driver ${id}`, flag: 'br' },
        team: { id: 't1', name: 'Ferrari' },
        season: { id: 's1', year: 2026 },
      },
      race: raceSummary,
      startingPosition: 1,
      finishingPosition: 1,
      startingPositionSprint: 0,
      finishingPositionSprint: 0,
      context: '',
      ...overrides,
    };
  }

  function raceResponse(results: DriverRaceResultSummaryDTO[], isSprint = false): RaceResponseDTO {
    return { ...raceSummary, isSprint, season: { id: 's1', year: 2026 }, driverRaceResults: results };
  }

  beforeEach(async () => {
    isAuthenticated = signal(false);

    await TestBed.configureTestingModule({
      imports: [RacesPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { isAuthenticated } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RacesPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function flushInit(currentRaceStatus: 'found' | 'none' = 'found') {
    httpMock.expectOne((r) => r.url === `${raceUrl}/year/2026`).flush([raceSummary]);
    httpMock.expectOne(seasonUrl).flush(seasons);

    const currentReq = httpMock.expectOne(`${raceUrl}/current`);
    if (currentRaceStatus === 'found') {
      currentReq.flush(raceResponse([driverResult('res1', 'ds1')]));
    } else {
      currentReq.flush('none', { status: 404, statusText: 'Not Found' });
    }
  }

  it('selects the current race and its year on init when one exists', () => {
    fixture.detectChanges();
    flushInit('found');

    expect(component.selectedYear).toBe('2026');
    expect(component.selectedRaceId).toBe('r1');

    const raceReq = httpMock.expectOne(`${raceUrl}/r1`);
    raceReq.flush(raceResponse([driverResult('res1', 'ds1')]));
    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush([]);

    expect(component.isSeasonView()).toBe(false);
    expect(component.loading()).toBe(false);
  });

  it('falls back to season standings when there is no current race', () => {
    fixture.detectChanges();
    flushInit('none');

    expect(component.selectedRaceId).toBeNull();

    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush([]);

    expect(component.isSeasonView()).toBe(true);
    expect(component.loading()).toBe(false);
  });

  it('sorts season standings by average rating, descending', () => {
    fixture.detectChanges();
    flushInit('none');

    const ratings: DriverSeasonRating[] = [
      { driverSeasonId: 'ds1', driverName: 'A', driverFlag: 'br', teamName: 'Ferrari', averageRating: 5 },
      { driverSeasonId: 'ds2', driverName: 'B', driverFlag: 'nl', teamName: 'Red Bull', averageRating: 9 },
    ];
    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush(ratings);

    expect(component.standings().map((s) => s.driverSeasonId)).toEqual(['ds2', 'ds1']);
    expect(component.displayResults().map((d) => d.id)).toEqual(['ds2', 'ds1']);
  });

  it('onYearChange() reloads races for the new year and shows season standings', () => {
    fixture.detectChanges();
    flushInit('none');
    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush([]);

    component.selectedYear = '2025';
    component.onYearChange();

    expect(component.selectedRaceId).toBeNull();
    httpMock.expectOne(`${raceUrl}/year/2025`).flush([]);
    httpMock.expectOne((r) => r.url === `${ratingUrl}/global` && r.params.get('year') === '2025').flush([]);

    expect(component.loading()).toBe(false);
  });

  it('onRaceChange() loads the race view when a race id is set', () => {
    fixture.detectChanges();
    flushInit('none');
    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush([]);

    component.selectedRaceId = 'r1';
    component.onRaceChange();

    httpMock.expectOne(`${raceUrl}/r1`).flush(raceResponse([driverResult('res1', 'ds1')]));
    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush([]);

    expect(component.isSeasonView()).toBe(false);
  });

  it('onRaceChange() falls back to season standings when no race id is set', () => {
    fixture.detectChanges();
    flushInit('found');
    httpMock.expectOne(`${raceUrl}/r1`).flush(raceResponse([]));
    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush([]);

    component.selectedRaceId = null;
    component.onRaceChange();

    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush([]);
    expect(component.isSeasonView()).toBe(true);
  });

  it('toggleOnlyMine() is a no-op when communityId is set', () => {
    fixture.componentRef.setInput('communityId', 'c1');
    fixture.detectChanges();

    httpMock.expectOne((r) => r.url === `${raceUrl}/year/2026`).flush([raceSummary]);
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(`${raceUrl}/current`).flush('none', { status: 404, statusText: 'Not Found' });
    httpMock.expectOne((r) => r.url === `${ratingUrl}/community/c1`).flush([]);

    component.toggleOnlyMine();
    expect(component.onlyMine).toBe(false);
    httpMock.expectNone((r) => r.url === `${ratingUrl}/user`);
  });

  it('toggleOnlyMine() switches to user ratings when authenticated', () => {
    isAuthenticated.set(true);
    fixture.detectChanges();
    flushInit('none');
    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush([]);

    component.toggleOnlyMine();
    expect(component.onlyMine).toBe(true);

    httpMock.expectOne((r) => r.url === `${ratingUrl}/user`).flush([]);
  });

  it('getRatings$ resolves to an empty list for "only mine" when unauthenticated (no request made)', () => {
    isAuthenticated.set(false);
    fixture.detectChanges();
    flushInit('none');
    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush([]);

    component.toggleOnlyMine();

    httpMock.expectNone((r) => r.url.startsWith(`${ratingUrl}/user`));
    httpMock.expectNone((r) => r.url.startsWith(`${ratingUrl}/global`));
    expect(component.standings()).toEqual([]);
    expect(component.loading()).toBe(false);
  });

  it('filters out blank driver results (no positions, no context) from the race view', () => {
    fixture.detectChanges();
    flushInit('found');

    const blank = driverResult('blank', 'ds-blank', { startingPosition: 0, finishingPosition: 0, context: '' });
    const real = driverResult('real', 'ds-real');
    httpMock.expectOne(`${raceUrl}/r1`).flush(raceResponse([blank, real]));
    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush([]);

    expect(component.displayResults().map((d) => d.id)).toEqual(['real']);
  });

  it('attaches ratings by driver-season id and sorts results by rating order', () => {
    fixture.detectChanges();
    flushInit('found');

    const first = driverResult('a', 'ds-a');
    const second = driverResult('b', 'ds-b');
    httpMock.expectOne(`${raceUrl}/r1`).flush(raceResponse([first, second]));

    httpMock
      .expectOne((r) => r.url === `${ratingUrl}/global`)
      .flush([
        { driverSeasonId: 'ds-b', driverName: 'B', driverFlag: 'br', teamName: 'Ferrari', averageRating: 9 },
        { driverSeasonId: 'ds-a', driverName: 'A', driverFlag: 'br', teamName: 'Ferrari', averageRating: 7 },
      ]);

    expect(component.raceView()?.driverRaceResults.map((r) => r.id)).toEqual(['b', 'a']);
    expect(component.displayResults().find((d) => d.id === 'b')?.score).toBe(9);
  });

  it('omits sprint fields from display results for a non-sprint race', () => {
    fixture.detectChanges();
    flushInit('found');
    httpMock.expectOne(`${raceUrl}/r1`).flush(raceResponse([driverResult('a', 'ds-a')], false));
    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush([]);

    expect(component.displayResults()[0].startingPositionSprint).toBeUndefined();
  });

  it('includes sprint fields for a sprint race', () => {
    fixture.detectChanges();
    flushInit('found');
    httpMock
      .expectOne(`${raceUrl}/r1`)
      .flush(raceResponse([driverResult('a', 'ds-a', { startingPositionSprint: 2, finishingPositionSprint: 1 })], true));
    httpMock.expectOne((r) => r.url === `${ratingUrl}/global`).flush([]);

    expect(component.displayResults()[0].startingPositionSprint).toBe(2);
    expect(component.displayResults()[0].finishingPositionSprint).toBe(1);
  });

  describe('pure helpers', () => {
    it('finishLabel() renders DNF for 0, otherwise P<position>', () => {
      expect(component.finishLabel(0)).toBe('DNF');
      expect(component.finishLabel(2)).toBe('P2');
    });

    it('teamColor() falls back to gray for unknown teams', () => {
      expect(component.teamColor('Ferrari')).toBe('#E8002D');
      expect(component.teamColor('???')).toBe('#6b7280');
    });

    it('scoreColorClass() special-cases a perfect 10', () => {
      expect(component.scoreColorClass(10)).toBe('text-[#00BFFF]');
      expect(component.scoreColorClass(8)).toBe('text-emerald-400');
      expect(component.scoreColorClass(6)).toBe('text-yellow-400');
      expect(component.scoreColorClass(4)).toBe('text-orange-400');
      expect(component.scoreColorClass(1)).toBe('text-red-400');
    });

    it('flagUrl() lowercases the country code', () => {
      expect(component.flagUrl('BR')).toBe('https://flagcdn.com/br.svg');
    });

    it('toggleContext() flips the open state for an item', () => {
      component.toggleContext('x');
      expect(component.contextOpen['x']).toBe(true);
      component.toggleContext('x');
      expect(component.contextOpen['x']).toBe(false);
    });
  });
});
