import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminDriverSeasonsPageComponent } from './admin-driver-seasons-page.component';
import { environment } from '../../../../../environments/environment';
import { SeasonSummaryDTO } from '../../../seasons/models/season.model';
import { DriverSummaryDTO } from '../../../drivers/models/driver.model';
import { TeamResponseDTO } from '../../../../shared/models/team.model';
import { DriverSeasonSummaryDTO } from '../../../seasons/models/driver-season.model';

describe('AdminDriverSeasonsPageComponent (integration)', () => {
  let fixture: ComponentFixture<AdminDriverSeasonsPageComponent>;
  let component: AdminDriverSeasonsPageComponent;
  let httpMock: HttpTestingController;

  const seasonUrl = `${environment.apiUrl}/season`;
  const driverUrl = `${environment.apiUrl}/driver`;
  const teamUrl = `${environment.apiUrl}/team`;
  const driverSeasonUrl = `${environment.apiUrl}/driverseason`;

  const seasons: SeasonSummaryDTO[] = [
    { id: 's-2025', year: 2025 },
    { id: 's-2026', year: 2026 },
  ];
  const drivers: DriverSummaryDTO[] = [{ id: 'd1', name: 'Max Verstappen', flag: 'nl' }];
  const teams: TeamResponseDTO[] = [{ id: 't1', name: 'Red Bull' }];

  function driverSeason(
    id: string,
    seasonId: string,
    driverNumber: number
  ): DriverSeasonSummaryDTO {
    return {
      id,
      driverNumber,
      driver: { id: 'd1', name: 'Max Verstappen', flag: 'nl' },
      team: { id: 't1', name: 'Red Bull' },
      season: { id: seasonId, year: 2026 },
    };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDriverSeasonsPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDriverSeasonsPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function flushInitialLoad(driverSeasons: DriverSeasonSummaryDTO[] = []) {
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(driverUrl).flush(drivers);
    httpMock.expectOne(teamUrl).flush(teams);
    httpMock.expectOne(driverSeasonUrl).flush(driverSeasons);
  }

  it('loads seasons, drivers, teams and driver-seasons together and auto-selects the newest season', () => {
    fixture.detectChanges();
    flushInitialLoad();

    expect(component.selectedSeasonId).toBe('s-2026');
    expect(component.seasons().map((s) => s.id)).toEqual(['s-2026', 's-2025']);
    expect(component.drivers()).toEqual(drivers);
    expect(component.teams()).toEqual(teams);
    expect(component.loading()).toBe(false);
  });

  it('stops loading if the initial forkJoin fails', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush('err', { status: 500, statusText: 'Server Error' });
    // forkJoin unsubscribes from the other in-flight requests as soon as one
    // errors, so they can be matched (to drain the pending queue) but not flushed.
    httpMock.expectOne(driverUrl);
    httpMock.expectOne(teamUrl);
    httpMock.expectOne(driverSeasonUrl);

    expect(component.loading()).toBe(false);
  });

  it('filteredDriverSeasons only includes links for the selected season, sorted by driver number', () => {
    fixture.detectChanges();
    flushInitialLoad([
      driverSeason('ds1', 's-2026', 3),
      driverSeason('ds2', 's-2025', 1),
      driverSeason('ds3', 's-2026', 1),
    ]);

    expect(component.filteredDriverSeasons().map((ds) => ds.id)).toEqual(['ds3', 'ds1']);
  });

  it('updates the filtered list when a different season is selected', () => {
    fixture.detectChanges();
    flushInitialLoad([driverSeason('ds1', 's-2026', 1), driverSeason('ds2', 's-2025', 2)]);

    component.selectedSeasonId = 's-2025';
    component.onSeasonChange();

    expect(component.filteredDriverSeasons().map((ds) => ds.id)).toEqual(['ds2']);
  });

  it('does not submit when required form fields are missing', () => {
    fixture.detectChanges();
    flushInitialLoad();

    component.form = { driverId: '', teamId: 't1', driverNumber: 1 };
    component.create();
    httpMock.expectNone((req) => req.method === 'POST');
  });

  it('creates a driver-season link for the selected season and reloads the list', () => {
    fixture.detectChanges();
    flushInitialLoad([]);

    component.form = { driverId: 'd1', teamId: 't1', driverNumber: 1 };
    component.create();

    const req = httpMock.expectOne(driverSeasonUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      driverId: 'd1',
      teamId: 't1',
      driverNumber: 1,
      seasonId: 's-2026',
    });
    req.flush(driverSeason('ds1', 's-2026', 1));

    expect(component.form).toEqual({ driverId: '', teamId: '', driverNumber: null });

    httpMock.expectOne(driverSeasonUrl).flush([driverSeason('ds1', 's-2026', 1)]);
    expect(component.driverSeasons().length).toBe(1);
  });

  it('surfaces the API error message on failed creation', () => {
    fixture.detectChanges();
    flushInitialLoad([]);

    component.form = { driverId: 'd1', teamId: 't1', driverNumber: 1 };
    component.create();

    httpMock
      .expectOne(driverSeasonUrl)
      .flush({ error: 'Driver already linked this season.' }, { status: 400, statusText: 'Bad Request' });

    expect(component.errorMessage()).toBe('Driver already linked this season.');
  });

  it('deletes a driver-season link and reloads', () => {
    fixture.detectChanges();
    flushInitialLoad([driverSeason('ds1', 's-2026', 1)]);

    component.delete('ds1');

    const req = httpMock.expectOne(`${driverSeasonUrl}/ds1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    httpMock.expectOne(driverSeasonUrl).flush([]);
    expect(component.driverSeasons().length).toBe(0);
  });

  it('surfaces the default error message when a driver-season cannot be deleted', () => {
    fixture.detectChanges();
    flushInitialLoad([driverSeason('ds1', 's-2026', 1)]);

    component.delete('ds1');

    httpMock.expectOne(`${driverSeasonUrl}/ds1`).flush({}, { status: 409, statusText: 'Conflict' });

    expect(component.errorMessage()).toBe(
      'Could not remove this link, this driver already has results associated with him.'
    );
  });
});
