import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  await authService.initialized;

  if (authService.isLoggedIn) {
    return true;
  }

  messageService.show('You must log in first to access this page.');
  return router.parseUrl('/login');
};
