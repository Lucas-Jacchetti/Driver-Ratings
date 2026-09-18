import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SeasonsService } from './seasons.service';
import { environment } from '../../../../environments/environment';
import { SeasonCreationDTO, SeasonResponseDTO } from '../models/season.model';
import { DriverSeasonCreationDTO, DriverSeasonSummaryDTO } from '../models/driver-season.model';

describe('SeasonsService', () => {
  let service: SeasonsService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/season`;
  const driverSeasonUrl = `${environment.apiUrl}/driverseason`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeasonsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SeasonsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll() GETs the base season URL', () => {
    const mock: SeasonResponseDTO[] = [
      { id: '1', year: 2026, races: [], driverSeasons: [] },
    ];

    service.getAll().subscribe((seasons) => expect(seasons).toEqual(mock));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getById() GETs /season/:id', () => {
    const mock: SeasonResponseDTO = { id: '1', year: 2026, races: [], driverSeasons: [] };

    service.getById('1').subscribe((season) => expect(season).toEqual(mock));

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('create() POSTs the season payload', () => {
    const dto: SeasonCreationDTO = { year: 2027 };
    const mockResponse: SeasonResponseDTO = { id: '2', year: 2027, races: [], driverSeasons: [] };

    service.create(dto).subscribe((season) => expect(season).toEqual(mockResponse));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);
  });

  it('delete() DELETEs /season/:id', () => {
    service.delete('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('addDriverSeason() POSTs to the driver-season endpoint', () => {
    const dto: DriverSeasonCreationDTO = {
      driverNumber: 1,
      driverId: 'd1',
      teamId: 't1',
      seasonId: 's1',
    };
    const mockResponse = { id: 'ds1' } as unknown as DriverSeasonSummaryDTO;

    service.addDriverSeason(dto).subscribe((res) => expect(res).toEqual(mockResponse));

    const req = httpMock.expectOne(driverSeasonUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);
  });

  it('getAllDriverSeasons() GETs the driver-season endpoint', () => {
    const mock = [{ id: 'ds1' }] as unknown as DriverSeasonSummaryDTO[];

    service.getAllDriverSeasons().subscribe((res) => expect(res).toEqual(mock));

    const req = httpMock.expectOne(driverSeasonUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('deleteDriverSeason() DELETEs /driverseason/:id', () => {
    service.deleteDriverSeason('ds1').subscribe();

    const req = httpMock.expectOne(`${driverSeasonUrl}/ds1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
