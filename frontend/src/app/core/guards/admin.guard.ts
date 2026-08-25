import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

// Mesma logica do authGuard, mas tambem exige a role de admin.
// Hoje a API ainda nao manda role nenhuma, entao isAdmin() sempre da false
// e isso aqui bloqueia geral -- e so o esperado ate as roles existirem de fato no backend.
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
