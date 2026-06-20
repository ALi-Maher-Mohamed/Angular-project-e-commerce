import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCard, FormsModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private favoriteService = inject(FavoriteService);

  readonly products = this.productService.products;
  readonly cartItems = this.cartService.cartItems;
  readonly favorites = this.favoriteService.favorites;

  readonly cartCount = computed(() => this.cartItems().length);
  readonly favoritesCount = computed(() => this.favorites().length);
  readonly favoriteProductIds = computed(() => new Set(this.favorites().map((fav) => fav.productId)));
  readonly cartProductIds = computed(() => new Set(this.cartItems().map((item) => item.productId)));

  selectedCategory = signal<string>('All');
  sortOrder = signal<string>('none');

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

  onAddToCart(event: { product: Product; quantity: number }): void {
    this.cartService.addToCart(event.product.id, event.quantity).subscribe();
  }

  onToggleFavorite(product: Product): void {
    this.favoriteService.toggleFavorite(product.id).subscribe();
  }

  isFavorited(productId: number): boolean {
    return this.favoriteProductIds().has(productId);
  }

  isInCart(productId: number): boolean {
    return this.cartProductIds().has(productId);
  }

  onDelete(id: number): void {
    this.productService.delete(id).subscribe();
    this.cartService.removeByProductId(id).subscribe();
    this.favoriteService.removeByProductId(id).subscribe();
  }
}
