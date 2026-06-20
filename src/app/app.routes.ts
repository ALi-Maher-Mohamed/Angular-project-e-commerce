import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Router } from '@angular/router';
import { MainLayout } from '../components/main-layout/main-layout';
import { Login } from '../components/login/login';
import { SignUp } from '../components/signup/signup';
import { ErrorPage } from '../components/error/error';
import { authGuard } from '../guards/auth.guard';
import { MessageService } from '../services/message.service';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: SignUp },
  {
    path: '',
    component: MainLayout,
    canActivateChild: [authGuard],
    loadChildren: () => import('./products.routes').then((m) => m.productRoutes),
  },
  { path: 'error', component: ErrorPage },
  {
    path: '**',
    canActivate: [
      () => {
        const router = inject(Router);
        const messageService = inject(MessageService);
        messageService.show('You must log in first to access this page.');
        return router.parseUrl('/signup');
      },
    ],
    component: ErrorPage,
  },
];
