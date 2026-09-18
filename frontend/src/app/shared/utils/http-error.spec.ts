import { HttpErrorResponse } from '@angular/common/http';
import { extractApiError } from './http-error';

describe('extractApiError', () => {
  it('returns the API error message when present on an HttpErrorResponse', () => {
    const err = new HttpErrorResponse({
      error: { error: 'Name already in use.' },
      status: 400,
    });

    expect(extractApiError(err, 'fallback')).toBe('Name already in use.');
  });

  it('returns the fallback when the HttpErrorResponse has no error.error string', () => {
    const err = new HttpErrorResponse({ error: {}, status: 500 });

    expect(extractApiError(err, 'fallback message')).toBe('fallback message');
  });

  it('returns the fallback when error.error is an empty string', () => {
    const err = new HttpErrorResponse({ error: { error: '' }, status: 400 });

    expect(extractApiError(err, 'fallback message')).toBe('fallback message');
  });

  it('returns the fallback when error.error is not a string', () => {
    const err = new HttpErrorResponse({ error: { error: 42 }, status: 400 });

    expect(extractApiError(err, 'fallback message')).toBe('fallback message');
  });

  it('returns the fallback when the error body itself is null', () => {
    const err = new HttpErrorResponse({ error: null, status: 0 });

    expect(extractApiError(err, 'fallback message')).toBe('fallback message');
  });

  it('returns the fallback when err is not an HttpErrorResponse at all', () => {
    expect(extractApiError(new Error('boom'), 'fallback message')).toBe('fallback message');
    expect(extractApiError('some string', 'fallback message')).toBe('fallback message');
    expect(extractApiError(undefined, 'fallback message')).toBe('fallback message');
    expect(extractApiError(null, 'fallback message')).toBe('fallback message');
  });
});
