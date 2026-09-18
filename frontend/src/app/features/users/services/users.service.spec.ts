import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { environment } from '../../../../environments/environment';
import { UserResponseDTO } from '../../../shared/models/user.model';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getById() GETs /users/:id and returns the user', () => {
    const mock: UserResponseDTO = {
      id: 'u1',
      name: 'Lucas',
      email: 'lucas@example.com',
      createdAt: '2026-01-01T00:00:00Z',
    };

    service.getById('u1').subscribe((user) => expect(user).toEqual(mock));

    const req = httpMock.expectOne(`${baseUrl}/u1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});
