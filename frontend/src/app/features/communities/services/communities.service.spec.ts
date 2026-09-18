import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CommunitiesService } from './communities.service';
import { environment } from '../../../../environments/environment';
import {
  CommunityCreationDTO,
  CommunityMemberCreationDTO,
  CommunityResponseDTO,
  CommunityUpdateRequest,
  PagedResult,
} from '../models/community.model';

describe('CommunitiesService', () => {
  let service: CommunitiesService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/community`;
  const memberUrl = `${environment.apiUrl}/communitymember`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommunitiesService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CommunitiesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll() GETs the base URL with default paging params', () => {
    const mock: PagedResult<CommunityResponseDTO> = {
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    };

    service.getAll().subscribe((res) => expect(res).toEqual(mock));

    const req = httpMock.expectOne(
      (r) => r.url === baseUrl && r.params.get('page') === '1' && r.params.get('pageSize') === '20'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getAll() forwards custom page and pageSize', () => {
    service.getAll(3, 10).subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === baseUrl && r.params.get('page') === '3' && r.params.get('pageSize') === '10'
    );
    req.flush({ items: [], totalCount: 0, page: 3, pageSize: 10, totalPages: 0 });
  });

  it('create() POSTs the community payload', () => {
    const dto: CommunityCreationDTO = {
      name: 'Fórmula BR',
      description: 'Comunidade brasileira',
      isPublic: true,
      imgUrl: null,
    };

    service.create(dto).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({} as CommunityResponseDTO);
  });

  it('update() PATCHes /community/:id', () => {
    const request: CommunityUpdateRequest = { name: 'Novo nome' };

    service.update('c1', request).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/c1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(request);
    req.flush({} as CommunityResponseDTO);
  });

  it('createMember() POSTs to the community member endpoint', () => {
    const dto: CommunityMemberCreationDTO = { communityId: 'c1', accessToken: 'abc' };

    service.createMember(dto).subscribe();

    const req = httpMock.expectOne(memberUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(null);
  });

  it('leave() DELETEs /communitymember/:id/members/me', () => {
    service.leave('c1').subscribe();

    const req = httpMock.expectOne(`${memberUrl}/c1/members/me`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('getMy() GETs /community/my', () => {
    service.getMy().subscribe();

    const req = httpMock.expectOne(`${baseUrl}/my`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getByCode() GETs /community/by-code/:accessCode', () => {
    service.getByCode('XYZ123').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/by-code/XYZ123`);
    expect(req.request.method).toBe('GET');
    req.flush({} as CommunityResponseDTO);
  });
});
