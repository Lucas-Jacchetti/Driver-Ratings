import { HttpErrorResponse } from '@angular/common/http';

export function extractApiError(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse) {
    const message = err.error?.error;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }
  return fallback;
}
