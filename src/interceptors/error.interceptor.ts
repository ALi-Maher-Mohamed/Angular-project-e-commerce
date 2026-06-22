import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout();
        messageService.show('Session expired. Please log in again.');
        router.navigate(['/login']);
        return throwError(() => error);
      }

      const serverMsg = error.error?.message;
      const msg = serverMsg
        || (error.status
          ? `Error ${error.status}: ${error.statusText || 'Request failed'}`
          : 'Network error. Please check your connection.');
      messageService.show(msg);
      return throwError(() => error);
    }),
  );
};
