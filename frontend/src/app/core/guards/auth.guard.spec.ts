import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../../features/auth/services/auth.service';

describe('authGuard', () => {
  let authServiceMock: { isAuthenticated: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(() => {
    authServiceMock = { isAuthenticated: jest.fn() };
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  function runGuard() {
    return TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
  }

  it('allows navigation when the user is authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);

    const result = runGuard();

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('blocks navigation and redirects to "/" when the user is not authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);

    const result = runGuard();

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
