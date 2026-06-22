import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Router } from '@angular/router';
import { MainLayout } from '../components/main-layout/main-layout';
import { Login } from '../components/login/login';
import { SignUp } from '../components/signup/signup';
import { ErrorPage } from '../components/error/error';
import { authGuard } from '../guards/auth.guard';
import { adminGuard } from '../guards/admin.guard';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: SignUp },
  {
    path: 'admin',
    component: MainLayout,
    canActivateChild: [authGuard, adminGuard],
    loadChildren: () => import('./admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '',
    component: MainLayout,
    canActivateChild: [authGuard],
    loadChildren: () => import('./customer.routes').then((m) => m.customerRoutes),
  },
  { path: 'error', component: ErrorPage },
  {
    path: '**',
    canActivate: [
      async () => {
        const router = inject(Router);
        const messageService = inject(MessageService);
        const authService = inject(AuthService);
        await authService.initialized;
        if (authService.isLoggedIn) {
          return router.parseUrl('/products');
        }
        messageService.show('You must log in first to access this page.');
        return router.parseUrl('/login');
      },
    ],
    component: ErrorPage,
  },
];
