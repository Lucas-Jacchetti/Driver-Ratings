import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { adminGuard } from './admin.guard';
import { AuthService } from '../../features/auth/services/auth.service';

describe('adminGuard', () => {
  let authServiceMock: { refreshCurrentUser: jest.Mock; isAdmin: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(() => {
    authServiceMock = { refreshCurrentUser: jest.fn(), isAdmin: jest.fn() };
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  function runGuard(): Observable<boolean> {
    return TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any)) as Observable<boolean>;
  }

  it('allows navigation when refreshCurrentUser succeeds and the user is an admin', (done) => {
    authServiceMock.refreshCurrentUser.mockReturnValue(of({}));
    authServiceMock.isAdmin.mockReturnValue(true);

    runGuard().subscribe((result) => {
      expect(result).toBe(true);
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('blocks navigation and redirects to "/" when the user is not an admin', (done) => {
    authServiceMock.refreshCurrentUser.mockReturnValue(of({}));
    authServiceMock.isAdmin.mockReturnValue(false);

    runGuard().subscribe((result) => {
      expect(result).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });

  it('blocks navigation and redirects to "/" when refreshCurrentUser errors out', (done) => {
    authServiceMock.refreshCurrentUser.mockReturnValue(throwError(() => new Error('network error')));

    runGuard().subscribe((result) => {
      expect(result).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });
});
