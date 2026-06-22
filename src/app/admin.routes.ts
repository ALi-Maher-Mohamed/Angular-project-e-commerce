import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../components/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
  },
  {
    path: 'add-product',
    loadComponent: () =>
      import('../components/product-form/product-form').then((m) => m.ProductForm),
  },
  {
    path: 'edit-product/:id',
    loadComponent: () =>
      import('../components/product-form/product-form').then((m) => m.ProductForm),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('../components/product-details/product-details').then((m) => m.ProductDetails),
  },
];
