import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { ImageZoomDirective } from '../../directives/image-zoom.directive';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink, ImageZoomDirective],
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

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.fetchById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isFavorited = this.favoriteService.getByProductId(product.id) !== undefined;
      },
      error: () => {
        this.router.navigate(['/error']);
      },
    });
  }

  onDelete(): void {
    if (!this.product) return;
    this.productService.delete(this.product.id).subscribe({
      next: () => this.router.navigate(['/products']),
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
      },
    });
  }
}
