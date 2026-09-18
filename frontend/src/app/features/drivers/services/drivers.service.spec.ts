import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DriversService } from './drivers.service';
import { environment } from '../../../../environments/environment';
import { DriverCreationDTO, DriverResponseDTO } from '../models/driver.model';

describe('DriversService', () => {
  let service: DriversService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/driver`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DriversService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DriversService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll() sends a GET to the base driver URL and returns the drivers', () => {
    const mockDrivers: DriverResponseDTO[] = [
      { id: '1', name: 'Max Verstappen', flag: 'nl', driverSeasons: [] },
    ];

    service.getAll().subscribe((drivers) => {
      expect(drivers).toEqual(mockDrivers);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockDrivers);
  });

  it('getById() sends a GET to /driver/:id', () => {
    const mockDriver: DriverResponseDTO = { id: '1', name: 'Max Verstappen', flag: 'nl', driverSeasons: [] };

    service.getById('1').subscribe((driver) => {
      expect(driver).toEqual(mockDriver);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDriver);
  });

  it('create() sends a POST with the driver payload', () => {
    const dto: DriverCreationDTO = { name: 'Lando Norris', flag: 'gb' };
    const mockResponse: DriverResponseDTO = { id: '2', ...dto, driverSeasons: [] };

    service.create(dto).subscribe((driver) => {
      expect(driver).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);
  });

  it('delete() sends a DELETE to /driver/:id', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
