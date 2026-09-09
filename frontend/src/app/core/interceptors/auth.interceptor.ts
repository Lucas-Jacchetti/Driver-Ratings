import { HttpInterceptorFn } from '@angular/common/http';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authReq = req.clone({ withCredentials: true });

  if (!SAFE_METHODS.has(req.method)) {
    const csrfToken = readCookie('csrf_token');
    if (csrfToken) {
      authReq = authReq.clone({ setHeaders: { 'X-CSRF-Token': csrfToken } });
    }
  }

  return next(authReq);
};