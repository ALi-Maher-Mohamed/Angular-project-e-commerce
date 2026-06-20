import { Component, ChangeDetectionStrategy, computed, signal, inject } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCard, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products {
  private productService = inject(ProductService);

  readonly products = this.productService.products;

  boughtProducts = signal<Set<number>>(new Set());
  totalPrice = signal(0);
  selectedCategory = signal<string>('All');
  sortOrder = signal<string>('none');
  showTotal = signal(false);

  readonly categories = computed(() => [...new Set(this.products().map((p) => p.category))]);

  readonly filteredProducts = computed(() => {
    let result =
      this.selectedCategory() === 'All'
        ? [...this.products()]
        : this.products().filter((p) => p.category === this.selectedCategory());

    if (this.sortOrder() === 'low') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder() === 'high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  });

  filterByCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  onBuy(event: { product: Product; quantity: number }): void {
    const { product, quantity } = event;
    if (product.stock < quantity) return;
    product.stock -= quantity;
    this.productService.update(product);
    this.boughtProducts.update((set) => new Set(set).add(product.id));
    this.totalPrice.update((price) => price + product.price * quantity);
  }

  isBought(productId: number): boolean {
    return this.boughtProducts().has(productId);
  }

  onDelete(id: number): void {
    this.productService.delete(id);
  }
}
