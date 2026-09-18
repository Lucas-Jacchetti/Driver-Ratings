import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import { UserResponseDTO } from '../../../shared/models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockUser: UserResponseDTO = {
    id: 'u1',
    name: 'Lucas',
    email: 'lucas@example.com',
    createdAt: '2026-01-01T00:00:00Z',
    role: 'User',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('starts with no current user and isAuthenticated false', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.isAdmin()).toBe(false);
  });

  describe('loginWithGoogle', () => {
    it('POSTs the idToken and updates currentUser/isAuthenticated on success', () => {
      service.loginWithGoogle('id-token-123').subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/google`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ idToken: 'id-token-123' });
      req.flush(mockUser);

      expect(service.currentUser()).toEqual(mockUser);
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('isAdmin', () => {
    it('is true only when the current user has the Admin role', () => {
      service.loginWithGoogle('token').subscribe();
      httpMock.expectOne(`${apiUrl}/auth/google`).flush({ ...mockUser, role: 'Admin' });

      expect(service.isAdmin()).toBe(true);
    });

    it('is false for a non-admin user', () => {
      service.loginWithGoogle('token').subscribe();
      httpMock.expectOne(`${apiUrl}/auth/google`).flush({ ...mockUser, role: 'User' });

      expect(service.isAdmin()).toBe(false);
    });
  });

  describe('logout', () => {
    it('POSTs to /auth/logout and clears currentUser on success', () => {
      service.loginWithGoogle('token').subscribe();
      httpMock.expectOne(`${apiUrl}/auth/google`).flush(mockUser);
      expect(service.isAuthenticated()).toBe(true);

      service.logout();

      const req = httpMock.expectOne(`${apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({});

      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });

    it('still clears currentUser when the logout request fails', () => {
      service.loginWithGoogle('token').subscribe();
      httpMock.expectOne(`${apiUrl}/auth/google`).flush(mockUser);

      service.logout();

      const req = httpMock.expectOne(`${apiUrl}/auth/logout`);
      req.flush('boom', { status: 500, statusText: 'Server Error' });

      expect(service.currentUser()).toBeNull();
    });
  });

  describe('refreshCurrentUser', () => {
    it('GETs /user/me and updates currentUser', () => {
      service.refreshCurrentUser().subscribe((user) => expect(user).toEqual(mockUser));

      const req = httpMock.expectOne(`${apiUrl}/user/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);

      expect(service.currentUser()).toEqual(mockUser);
    });
  });

  describe('initSession', () => {
    it('resolves with the user and sets currentUser when the session is valid', () => {
      service.initSession().subscribe((user) => expect(user).toEqual(mockUser));

      httpMock.expectOne(`${apiUrl}/user/me`).flush(mockUser);

      expect(service.currentUser()).toEqual(mockUser);
    });

    it('resolves with null and clears currentUser instead of throwing when there is no session', () => {
      let emitted: UserResponseDTO | null | undefined;

      service.initSession().subscribe((user) => (emitted = user));

      httpMock
        .expectOne(`${apiUrl}/user/me`)
        .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(emitted).toBeNull();
      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
