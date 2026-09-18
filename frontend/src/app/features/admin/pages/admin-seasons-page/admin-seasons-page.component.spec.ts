import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminSeasonsPageComponent } from './admin-seasons-page.component';
import { environment } from '../../../../../environments/environment';
import { SeasonResponseDTO } from '../../../seasons/models/season.model';

describe('AdminSeasonsPageComponent (integration)', () => {
  let fixture: ComponentFixture<AdminSeasonsPageComponent>;
  let component: AdminSeasonsPageComponent;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/season`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSeasonsPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSeasonsPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function flushInitialLoad(seasons: SeasonResponseDTO[] = []) {
    httpMock.expectOne(baseUrl).flush(seasons);
  }

  it('defaults the form year to the current year', () => {
    expect(component.form.year).toBe(new Date().getFullYear());
  });

  it('sorts loaded seasons by year, descending', () => {
    fixture.detectChanges();
    flushInitialLoad([
      { id: '1', year: 2024, races: [], driverSeasons: [] },
      { id: '2', year: 2026, races: [], driverSeasons: [] },
      { id: '3', year: 2025, races: [], driverSeasons: [] },
    ]);

    expect(component.seasons().map((s) => s.year)).toEqual([2026, 2025, 2024]);
  });

  it('shows the empty state when there are no seasons', () => {
    fixture.detectChanges();
    flushInitialLoad([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No seasons registered yet.');
  });

  it('does not submit when the year is falsy', () => {
    fixture.detectChanges();
    flushInitialLoad([]);

    component.form.year = 0 as unknown as number;
    component.create();

    httpMock.expectNone((req) => req.method === 'POST');
  });

  it('creates a season, resets the form and reloads', () => {
    fixture.detectChanges();
    flushInitialLoad([]);

    component.form.year = 2027;
    component.create();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.body).toEqual({ year: 2027 });
    req.flush({ id: '4', year: 2027, races: [], driverSeasons: [] });

    expect(component.form.year).toBe(new Date().getFullYear());
    flushInitialLoad([{ id: '4', year: 2027, races: [], driverSeasons: [] }]);
    expect(component.seasons().length).toBe(1);
  });

  it('surfaces the API error message on failed creation', () => {
    fixture.detectChanges();
    flushInitialLoad([]);

    component.form.year = 2027;
    component.create();

    httpMock
      .expectOne(baseUrl)
      .flush({ error: 'Season already exists.' }, { status: 400, statusText: 'Bad Request' });

    expect(component.errorMessage()).toBe('Season already exists.');
  });

  it('deletes a season and reloads', () => {
    fixture.detectChanges();
    flushInitialLoad([{ id: '1', year: 2026, races: [], driverSeasons: [] }]);

    component.delete('1');

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    flushInitialLoad([]);
    expect(component.seasons().length).toBe(0);
  });

  it('surfaces the API error message on failed deletion', () => {
    fixture.detectChanges();
    flushInitialLoad([{ id: '1', year: 2026, races: [], driverSeasons: [] }]);

    component.delete('1');

    httpMock
      .expectOne(`${baseUrl}/1`)
      .flush({ error: 'Season has races.' }, { status: 409, statusText: 'Conflict' });

    expect(component.errorMessage()).toBe('Season has races.');
  });
});
