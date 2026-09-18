import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminRacesPageComponent } from './admin-races-page.component';
import { environment } from '../../../../../environments/environment';
import { SeasonSummaryDTO } from '../../../seasons/models/season.model';
import { RaceSummaryDTO } from '../../../races/models/race.model';

describe('AdminRacesPageComponent (integration)', () => {
  let fixture: ComponentFixture<AdminRacesPageComponent>;
  let component: AdminRacesPageComponent;
  let httpMock: HttpTestingController;
  const seasonUrl = `${environment.apiUrl}/season`;
  const raceUrl = `${environment.apiUrl}/race`;

  const seasons: SeasonSummaryDTO[] = [
    { id: 's-2025', year: 2025 },
    { id: 's-2026', year: 2026 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRacesPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRacesPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('auto-selects the most recent season and loads its races', () => {
    fixture.detectChanges();

    httpMock.expectOne(seasonUrl).flush(seasons);
    expect(component.selectedSeasonId).toBe('s-2026');

    const racesReq = httpMock.expectOne(`${raceUrl}/year/2026`);
    racesReq.flush([]);

    expect(component.loading()).toBe(false);
  });

  it('sorts loaded races by date, ascending', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);

    const raceB: RaceSummaryDTO = { id: 'b', name: 'B', circuit: 'C', flag: 'br', date: '2026-05-01T00:00:00Z', isSprint: false };
    const raceA: RaceSummaryDTO = { id: 'a', name: 'A', circuit: 'C', flag: 'br', date: '2026-01-01T00:00:00Z', isSprint: false };

    httpMock.expectOne(`${raceUrl}/year/2026`).flush([raceB, raceA]);

    expect(component.races().map((r) => r.id)).toEqual(['a', 'b']);
  });

  it('shows "Create a season first" when there are no seasons', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush([]);
    fixture.detectChanges();

    expect(component.selectedSeasonId).toBe('');
    expect(component.loading()).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Create a season first.');
  });

  it('reloads races for the newly selected season on onSeasonChange()', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(`${raceUrl}/year/2026`).flush([]);

    component.selectedSeasonId = 's-2025';
    component.onSeasonChange();

    const req = httpMock.expectOne(`${raceUrl}/year/2025`);
    req.flush([]);
    expect(component.loading()).toBe(false);
  });

  it('does not submit the create form when required fields are missing', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(`${raceUrl}/year/2026`).flush([]);

    component.form = { name: '', circuit: 'Interlagos', flag: 'br', date: '2026-11-08T14:00', isSprint: false };
    component.create();

    httpMock.expectNone((req) => req.method === 'POST');
  });

  it('creates a race with a lowercase flag, a UTC-suffixed date and the selected season, then reloads', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(`${raceUrl}/year/2026`).flush([]);

    component.form = {
      name: 'Brazilian GP',
      circuit: 'Interlagos',
      flag: 'BR',
      date: '2026-11-08T14:00',
      isSprint: true,
    };
    component.create();

    const req = httpMock.expectOne(raceUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      name: 'Brazilian GP',
      circuit: 'Interlagos',
      flag: 'br',
      date: '2026-11-08T14:00:00Z',
      seasonId: 's-2026',
      isSprint: true,
    });
    req.flush({});

    expect(component.form).toEqual({ name: '', circuit: '', flag: '', date: '', isSprint: false });

    httpMock.expectOne(`${raceUrl}/year/2026`).flush([]);
  });

  it('surfaces the API error message on failed creation', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock.expectOne(`${raceUrl}/year/2026`).flush([]);

    component.form = { name: 'Bad', circuit: 'X', flag: 'br', date: '2026-11-08T14:00', isSprint: false };
    component.create();

    httpMock
      .expectOne(raceUrl)
      .flush({ error: 'Race conflicts with schedule.' }, { status: 400, statusText: 'Bad Request' });

    expect(component.errorMessage()).toBe('Race conflicts with schedule.');
  });

  it('deletes a race and reloads the current season', () => {
    fixture.detectChanges();
    httpMock.expectOne(seasonUrl).flush(seasons);
    httpMock
      .expectOne(`${raceUrl}/year/2026`)
      .flush([{ id: 'r1', name: 'GP', circuit: 'C', flag: 'br', date: '2026-01-01T00:00:00Z', isSprint: false }]);

    component.delete('r1');

    const req = httpMock.expectOne(`${raceUrl}/r1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    httpMock.expectOne(`${raceUrl}/year/2026`).flush([]);
    expect(component.races().length).toBe(0);
  });

  describe('helpers', () => {
    it('flagUrl() lowercases the country code', () => {
      expect(component.flagUrl('BR')).toBe('https://flagcdn.com/br.svg');
    });

    it('formatDate() returns the date unchanged', () => {
      expect(component.formatDate('2026-11-08T14:00:00Z')).toBe('2026-11-08T14:00:00Z');
    });
  });
});
