import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  function clearCookies() {
    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0].trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
  }

  afterEach(() => {
    clearCookies();
  });

  function runInterceptor(req: HttpRequest<unknown>) {
    let forwarded!: HttpRequest<unknown>;
    const next = (r: HttpRequest<unknown>) => {
      forwarded = r;
      return 'next-called' as any;
    };

    TestBed.runInInjectionContext(() => authInterceptor(req, next));
    return forwarded;
  }

  it('always sets withCredentials to true', () => {
    const req = new HttpRequest('GET', '/api/thing');

    const forwarded = runInterceptor(req);

    expect(forwarded.withCredentials).toBe(true);
  });

  it('does not add a CSRF header for safe methods, even when the cookie is present', () => {
    document.cookie = 'csrf_token=abc123';
    const req = new HttpRequest('GET', '/api/thing');

    const forwarded = runInterceptor(req);

    expect(forwarded.headers.has('X-CSRF-Token')).toBe(false);
  });

  it('adds the X-CSRF-Token header for unsafe methods when the cookie is present', () => {
    document.cookie = 'csrf_token=abc123';
    const req = new HttpRequest('POST', '/api/thing', {});

    const forwarded = runInterceptor(req);

    expect(forwarded.headers.get('X-CSRF-Token')).toBe('abc123');
  });

  it('does not add the header for unsafe methods when there is no csrf_token cookie', () => {
    const req = new HttpRequest('POST', '/api/thing', {});

    const forwarded = runInterceptor(req);

    expect(forwarded.headers.has('X-CSRF-Token')).toBe(false);
  });

  it('URL-decodes the cookie value', () => {
    document.cookie = `csrf_token=${encodeURIComponent('a b/c')}`;
    const req = new HttpRequest('DELETE', '/api/thing');

    const forwarded = runInterceptor(req);

    expect(forwarded.headers.get('X-CSRF-Token')).toBe('a b/c');
  });
});
