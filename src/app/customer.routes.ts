import { Routes } from '@angular/router';

export const customerRoutes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadComponent: () => import('../components/products/products').then((m) => m.Products),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('../components/product-details/product-details').then((m) => m.ProductDetails),
  },
  {
    path: 'cart',
    loadComponent: () => import('../components/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'favorites',
    loadComponent: () => import('../components/favorites/favorites').then((m) => m.Favorites),
  },
];
