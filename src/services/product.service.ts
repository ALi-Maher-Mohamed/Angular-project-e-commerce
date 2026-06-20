import { Injectable, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Product } from '../models/product';
import { PRODUCTS } from '../models/products-data';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private productsSignal = signal<Product[]>([...PRODUCTS]);

  readonly products = computed(() => this.productsSignal());
  readonly products$ = toObservable(this.productsSignal);

  getById(id: number): Product | undefined {
    return this.productsSignal().find((p) => p.id === id);
  }

  add(product: Product): void {
    this.productsSignal.update((products) => [...products, { ...product, id: Date.now() }]);
  }

  update(product: Product): void {
    this.productsSignal.update((products) =>
      products.map((p) => (p.id === product.id ? product : p)),
    );
  }

  delete(id: number): void {
    this.productsSignal.update((products) => products.filter((p) => p.id !== id));
  }
}
