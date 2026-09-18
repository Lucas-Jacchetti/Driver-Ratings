import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminRaceResultsPageComponent } from './admin-race-results-page.component';
import { environment } from '../../../../../environments/environment';
import { SeasonSummaryDTO } from '../../../seasons/models/season.model';
import { RaceSummaryDTO } from '../../../races/models/race.model';
import { DriverRaceResultSummaryDTO } from '../../../races/models/driver-race-result.model';

describe('AdminRaceResultsPageComponent (integration)', () => {
  let fixture: ComponentFixture<AdminRaceResultsPageComponent>;
  let component: AdminRaceResultsPageComponent;
  let httpMock: HttpTestingController;

  const seasonUrl = `${environment.apiUrl}/season`;
  const raceUrl = `${environment.apiUrl}/race`;
  const resultUrl = `${environment.apiUrl}/driverraceresult`;

  const seasons: SeasonSummaryDTO[] = [{ id: 's-2026', year: 2026 }];

  function race(id: string, date: string, isSprint = false): RaceSummaryDTO {
    return { id, name: `Race ${id}`, circuit: 'Circuit', flag: 'br', date, isSprint };
  }

  function result(id: string, driverNumber: number): DriverRaceResultSummaryDTO {
    return {
      id,
      driverSeason: {
        id: `ds-${id}`,
        driverNumber,
        driver: { id: `d-${id}`, name: `Driver ${id}`, flag: 'br' },
        team: { id: 't1', name: 'Team' },
        season: { id: 's-2026', year: 2026 },
      },
      race: race('r1', '2026-01-01T00:00:00Z'),
      startingPosition: driverNumber,
      finishingPosition: driverNumber,
      startingPositionSprint: 0,
      finishingPositionSprint: 0,
      context: '',
    };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRaceResultsPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRaceResultsPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('cascades from seasons -> races -> results, auto-selecting the earliest race and sorting by driver number', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);

    expect(component.selectedSeasonId).toBe('s-2026');

    httpMock
      .expectOne(`${raceUrl}/year/2026`)
      .flush([race('r2', '2026-05-01T00:00:00Z'), race('r1', '2026-01-01T00:00:00Z')]);

    expect(component.selectedRaceId).toBe('r1');

    httpMock.expectOne(`${resultUrl}/race/r1`).flush([result('a', 3), result('b', 1)]);

    expect(component.results().map((r) => r.id)).toEqual(['b', 'a']);
    expect(component.loading()).toBe(false);
  });

  it('stops loading without selecting a race when the season has none', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(`${raceUrl}/year/2026`).flush([]);

    expect(component.selectedRaceId).toBe('');
    expect(component.loading()).toBe(false);
  });

  it('surfaces the API error message when races fail to load', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock
      .expectOne(`${raceUrl}/year/2026`)
      .flush({ error: 'Races unavailable.' }, { status: 500, statusText: 'Server Error' });

    expect(component.errorMessage()).toBe('Races unavailable.');
    expect(component.loading()).toBe(false);
  });

  it('surfaces the API error message when results fail to load', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(`${raceUrl}/year/2026`).flush([race('r1', '2026-01-01T00:00:00Z')]);
    httpMock
      .expectOne(`${resultUrl}/race/r1`)
      .flush({ error: 'Results unavailable.' }, { status: 500, statusText: 'Server Error' });

    expect(component.errorMessage()).toBe('Results unavailable.');
  });

  it('isSprintRace() reflects the selected race', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(`${raceUrl}/year/2026`).flush([race('r1', '2026-01-01T00:00:00Z', true)]);
    httpMock.expectOne(`${resultUrl}/race/r1`).flush([]);

    expect(component.isSprintRace()).toBe(true);
  });

  it('onSeasonChange() resets race/results state and reloads races', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(`${raceUrl}/year/2026`).flush([race('r1', '2026-01-01T00:00:00Z')]);
    httpMock.expectOne(`${resultUrl}/race/r1`).flush([result('a', 1)]);

    component.onSeasonChange();

    expect(component.selectedRaceId).toBe('');
    expect(component.results()).toEqual([]);
    expect(component.saved()).toBe(false);

    // selectedSeasonId still points at s-2026, so it reloads that season's races.
    httpMock.expectOne(`${raceUrl}/year/2026`).flush([race('r1', '2026-01-01T00:00:00Z')]);
    httpMock.expectOne(`${resultUrl}/race/r1`).flush([]);
  });

  it('onRaceChange() reloads results for the newly selected race', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock
      .expectOne(`${raceUrl}/year/2026`)
      .flush([race('r1', '2026-01-01T00:00:00Z'), race('r2', '2026-05-01T00:00:00Z')]);
    httpMock.expectOne(`${resultUrl}/race/r1`).flush([]);

    component.selectedRaceId = 'r2';
    component.onRaceChange();

    const req = httpMock.expectOne(`${resultUrl}/race/r2`);
    req.flush([result('c', 5)]);

    expect(component.results().map((r) => r.id)).toEqual(['c']);
  });

  it('does not save when there is no selected race or no results', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(`${raceUrl}/year/2026`).flush([]);

    component.save();

    httpMock.expectNone((req) => req.method === 'PUT');
  });

  it('saves results, re-sorts the response and flags saved()', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(`${raceUrl}/year/2026`).flush([race('r1', '2026-01-01T00:00:00Z')]);
    httpMock.expectOne(`${resultUrl}/race/r1`).flush([result('a', 1)]);

    component.save();
    expect(component.saving()).toBe(true);

    const req = httpMock.expectOne(`${resultUrl}/race/r1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.results[0]).toEqual({
      driverRaceResultId: 'a',
      startingPosition: 1,
      finishingPosition: 1,
      startingPositionSprint: 0,
      finishingPositionSprint: 0,
      context: '',
    });

    req.flush([result('b', 2), result('a', 1)]);

    expect(component.results().map((r) => r.id)).toEqual(['a', 'b']);
    expect(component.saving()).toBe(false);
    expect(component.saved()).toBe(true);
  });

  it('surfaces the API error message when saving fails', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(`${raceUrl}/year/2026`).flush([race('r1', '2026-01-01T00:00:00Z')]);
    httpMock.expectOne(`${resultUrl}/race/r1`).flush([result('a', 1)]);

    component.save();

    httpMock
      .expectOne(`${resultUrl}/race/r1`)
      .flush({ error: 'Invalid positions.' }, { status: 400, statusText: 'Bad Request' });

    expect(component.errorMessage()).toBe('Invalid positions.');
    expect(component.saving()).toBe(false);
    expect(component.saved()).toBe(false);
  });

  it('flagUrl() lowercases the country code', () => {
    expect(component.flagUrl('BR')).toBe('https://flagcdn.com/br.svg');
  });
});
