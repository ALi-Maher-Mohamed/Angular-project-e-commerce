import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

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
  private cartService = inject(CartService);
  private favoriteService = inject(FavoriteService);
  readonly authService = inject(AuthService);

  readonly products = this.productService.products;
  readonly cartItems = this.cartService.cartItems;
  readonly favorites = this.favoriteService.favorites;

  readonly cartCount = computed(() => this.cartItems().length);
  readonly favoritesCount = computed(() => this.favorites().length);
  readonly favoriteProductIds = computed(() => new Set(this.favorites().map((fav) => String(fav.productId))));
  readonly cartProductIds = computed(() => new Set(this.cartItems().map((item) => String(item.productId))));

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

  get detailRoute(): string {
    return this.authService.isAdmin ? '/admin/product' : '/product';
  }

  filterByCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  onAddToCart(event: { product: Product; quantity: number }): void {
    this.cartService.addToCart(event.product.id, event.quantity).subscribe();
  }

  onRemoveFromCart(productId: number | string): void {
    this.cartService.removeByProductId(productId).subscribe();
  }

  onToggleFavorite(product: Product): void {
    this.favoriteService.toggleFavorite(product.id).subscribe();
  }

  isFavorited(productId: number | string): boolean {
    return this.favoriteProductIds().has(String(productId));
  }

  isInCart(productId: number | string): boolean {
    return this.cartProductIds().has(String(productId));
  }

  onDelete(id: number | string): void {
    this.productService.delete(id).subscribe();
    this.cartService.removeByProductId(id).subscribe();
    this.favoriteService.removeByProductId(id).subscribe();
  }
}
