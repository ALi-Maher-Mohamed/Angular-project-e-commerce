import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetails {
  product: Product | null = null;
  isFavorited = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private favoriteService = inject(FavoriteService);
  private cdr = inject(ChangeDetectorRef);
  readonly authService = inject(AuthService);

  get backLink(): string {
    return this.authService.isAdmin ? '/admin/dashboard' : '/products';
  }

  get editLink(): string[] {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    return this.authService.isAdmin ? ['/admin/edit-product', id] : ['/edit-product', id];
  }

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.fetchById(id).subscribe({
        next: (product) => {
          this.product = product;
          this.isFavorited = this.favoriteService.getByProductId(product.id) !== undefined;
          this.cdr.markForCheck();
        },
        error: () => {
          this.router.navigate(['/error']);
        },
      });
    }
  }

  onDelete(): void {
    if (!this.product) return;
    this.productService.delete(this.product.id).subscribe({
      next: () => this.router.navigate([this.backLink]),
      error: (error) => console.error('Failed to delete product', error),
    });
  }

  onAddToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product.id, 1).subscribe();
  }

  onToggleFavorite(): void {
    if (!this.product) return;
    this.favoriteService.toggleFavorite(this.product.id).subscribe({
      next: () => {
        this.isFavorited = !this.isFavorited;
        this.cdr.markForCheck();
      },
    });
  }
}
