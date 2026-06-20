import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '../services/message.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((error) => {
      const msg = error.status
        ? `Error ${error.status}: ${error.statusText || 'Request failed'}`
        : 'Network error. Please check your connection.';
      messageService.show(msg);
      return throwError(() => error);
    }),
  );
};
