import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = state => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser$();

  if (user) {
    return true; // Accès autorisé
  } else {
    // Rediriger vers login avec l'URL de retour
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false; // Accès refusé
  }
};
