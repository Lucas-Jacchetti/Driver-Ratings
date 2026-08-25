import { HttpErrorResponse } from '@angular/common/http';

// A API sempre retorna { error: "mensagem" } nos BadRequest/Conflict de criação
// e deleção (ver DriverController, TeamController, SeasonController, etc).
// Isso centraliza a extração dessa mensagem pras telas de admin.
export function extractApiError(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse) {
    const message = err.error?.error;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }
  return fallback;
}
