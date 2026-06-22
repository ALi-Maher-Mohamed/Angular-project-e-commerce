import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';
  private productsSignal = signal<Product[]>([]);

  readonly products = computed(() => this.productsSignal());
  readonly products$ = toObservable(this.productsSignal);

  constructor(private http: HttpClient) {
    this.loadProducts().subscribe({
      next: () => { },
      error: (error) => console.error('Failed to load products', error),
    });
  }

  loadProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((products) => this.productsSignal.set(products)),
      catchError((error) => {
        console.error(error);
        return EMPTY;
      }),
    );
  }

  getById(id: number | string): Product | undefined {
    const strId = String(id);
    return this.productsSignal().find((product) => String(product.id) === strId);
  }

  fetchById(id: number | string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  add(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap((created) => this.productsSignal.update((products) => [...products, created])),
    );
  }

  update(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product).pipe(
      tap((updated) =>
        this.productsSignal.update((products) =>
          products.map((existing) => (existing.id === updated.id ? updated : existing)),
        ),
      ),
    );
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const strId = String(id);
        this.productsSignal.update((products) =>
          products.filter((product) => String(product.id) !== strId),
        );
      }),
    );
  }
}
