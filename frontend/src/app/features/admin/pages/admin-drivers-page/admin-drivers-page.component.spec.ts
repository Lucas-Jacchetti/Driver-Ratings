import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminDriversPageComponent } from './admin-drivers-page.component';
import { environment } from '../../../../../environments/environment';
import { DriverResponseDTO } from '../../../drivers/models/driver.model';

describe('AdminDriversPageComponent (integration)', () => {
  let fixture: ComponentFixture<AdminDriversPageComponent>;
  let component: AdminDriversPageComponent;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/driver`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDriversPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDriversPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function flushInitialLoad(drivers: DriverResponseDTO[] = []) {
    httpMock.expectOne(baseUrl).flush(drivers);
  }

  it('loads and displays drivers on init', () => {
    fixture.detectChanges();
    flushInitialLoad([{ id: '1', name: 'Max Verstappen', flag: 'nl', driverSeasons: [] }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Max Verstappen');
  });

  it('shows the empty state when there are no drivers', () => {
    fixture.detectChanges();
    flushInitialLoad([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No drivers registered yet.');
  });

  it('does not submit when name or flag is blank', () => {
    fixture.detectChanges();
    flushInitialLoad([]);

    component.form = { name: 'Lando Norris', flag: '  ' };
    component.create();
    httpMock.expectNone((req) => req.method === 'POST');

    component.form = { name: '  ', flag: 'gb' };
    component.create();
    httpMock.expectNone((req) => req.method === 'POST');
  });

  it('lowercases the flag before sending it and reloads after creating', () => {
    fixture.detectChanges();
    flushInitialLoad([]);

    component.form = { name: 'Lando Norris', flag: 'GB' };
    component.create();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.body).toEqual({ name: 'Lando Norris', flag: 'gb' });
    req.flush({ id: '2', name: 'Lando Norris', flag: 'gb', driverSeasons: [] });

    expect(component.form).toEqual({ name: '', flag: '' });
    flushInitialLoad([{ id: '2', name: 'Lando Norris', flag: 'gb', driverSeasons: [] }]);
    expect(component.drivers().length).toBe(1);
  });

  it('surfaces the API error message on failed creation', () => {
    fixture.detectChanges();
    flushInitialLoad([]);

    component.form = { name: 'Bad Driver', flag: 'xx' };
    component.create();

    httpMock
      .expectOne(baseUrl)
      .flush({ error: 'Flag is invalid.' }, { status: 400, statusText: 'Bad Request' });

    expect(component.errorMessage()).toBe('Flag is invalid.');
  });

  it('deletes a driver and reloads', () => {
    fixture.detectChanges();
    flushInitialLoad([{ id: '1', name: 'Max Verstappen', flag: 'nl', driverSeasons: [] }]);

    component.delete('1');

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    flushInitialLoad([]);
    expect(component.drivers().length).toBe(0);
  });

  it('surfaces the API error message on failed deletion', () => {
    fixture.detectChanges();
    flushInitialLoad([{ id: '1', name: 'Max Verstappen', flag: 'nl', driverSeasons: [] }]);

    component.delete('1');

    httpMock
      .expectOne(`${baseUrl}/1`)
      .flush({ error: 'Driver has race results.' }, { status: 409, statusText: 'Conflict' });

    expect(component.errorMessage()).toBe('Driver has race results.');
  });

  describe('flagUrl', () => {
    it('builds a lowercase flagcdn URL from the country code', () => {
      expect(component.flagUrl('NL')).toBe('https://flagcdn.com/nl.svg');
    });
  });
});
