import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RacesService } from './races.service';
import { environment } from '../../../../environments/environment';
import { RaceCreationDTO, RaceResponseDTO, RaceSummaryDTO } from '../models/race.model';
import {
  DriverRaceResultSubmissionRequest,
  DriverRaceResultSummaryDTO,
} from '../models/driver-race-result.model';

describe('RacesService', () => {
  let service: RacesService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/race`;
  const driverRaceResultUrl = `${environment.apiUrl}/driverraceresult`;

  const raceSummary: RaceSummaryDTO = {
    id: 'r1',
    name: 'Brazilian GP',
    circuit: 'Interlagos',
    flag: 'br',
    date: '2026-11-08',
    isSprint: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RacesService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(RacesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll() GETs the base race URL', () => {
    service.getAll().subscribe((races) => expect(races).toEqual([raceSummary]));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([raceSummary]);
  });

  it('getById() GETs /race/:id', () => {
    const mock = { ...raceSummary, season: {}, driverRaceResults: [] } as unknown as RaceResponseDTO;

    service.getById('r1').subscribe((race) => expect(race).toEqual(mock));

    const req = httpMock.expectOne(`${baseUrl}/r1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('create() POSTs the race payload', () => {
    const dto: RaceCreationDTO = {
      name: 'Brazilian GP',
      circuit: 'Interlagos',
      flag: 'br',
      date: '2026-11-08',
      seasonId: 's1',
      isSprint: false,
    };
    const mock = { ...raceSummary, season: {}, driverRaceResults: [] } as unknown as RaceResponseDTO;

    service.create(dto).subscribe((race) => expect(race).toEqual(mock));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mock);
  });

  it('delete() DELETEs /race/:id', () => {
    service.delete('r1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/r1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('submitResults() PUTs to /driverraceresult/race/:raceId', () => {
    const request: DriverRaceResultSubmissionRequest = { results: [] };
    const mock: DriverRaceResultSummaryDTO[] = [];

    service.submitResults('r1', request).subscribe((res) => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${driverRaceResultUrl}/race/r1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(mock);
  });

  it('getCurrent() GETs /race/current', () => {
    const mock = { ...raceSummary, season: {}, driverRaceResults: [] } as unknown as RaceResponseDTO;

    service.getCurrent().subscribe((race) => expect(race).toEqual(mock));

    const req = httpMock.expectOne(`${baseUrl}/current`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getAllByYear() GETs /race/year/:year', () => {
    service.getAllByYear(2026).subscribe((races) => expect(races).toEqual([raceSummary]));

    const req = httpMock.expectOne(`${baseUrl}/year/2026`);
    expect(req.request.method).toBe('GET');
    req.flush([raceSummary]);
  });

  it('getRaceResultsByRace() GETs /driverraceresult/race/:raceId', () => {
    const mock: DriverRaceResultSummaryDTO[] = [];

    service.getRaceResultsByRace('r1').subscribe((res) => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${driverRaceResultUrl}/race/r1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});
