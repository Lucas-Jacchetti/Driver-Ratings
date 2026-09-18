import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TeamsService } from './teams.service';
import { environment } from '../../../environments/environment';
import { TeamCreationDTO, TeamResponseDTO } from '../models/team.model';

describe('TeamsService', () => {
  let service: TeamsService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/team`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TeamsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll() GETs the base team URL', () => {
    const mockTeams: TeamResponseDTO[] = [{ id: '1', name: 'Ferrari' }];

    service.getAll().subscribe((teams) => expect(teams).toEqual(mockTeams));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeams);
  });

  it('getById() GETs /team/:id', () => {
    const mockTeam: TeamResponseDTO = { id: '1', name: 'Ferrari' };

    service.getById('1').subscribe((team) => expect(team).toEqual(mockTeam));

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeam);
  });

  it('create() POSTs the team payload', () => {
    const dto: TeamCreationDTO = { name: 'McLaren' };
    const mockResponse: TeamResponseDTO = { id: '2', ...dto };

    service.create(dto).subscribe((team) => expect(team).toEqual(mockResponse));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);
  });

  it('delete() DELETEs /team/:id', () => {
    service.delete('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
