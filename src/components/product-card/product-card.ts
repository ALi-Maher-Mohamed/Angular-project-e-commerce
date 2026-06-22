import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Product } from '../../models/product';
import { ShortDescriptionPipe } from '../../pipes/short-description.pipe';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ShortDescriptionPipe, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  @Input() product!: Product;
  @Input() isFavorited = false;
  @Input() isInCart = false;
  @Input() detailRoute: string = '/product';
  @Output() addToCart = new EventEmitter<{ product: Product; quantity: number }>();
  @Output() removeFromCart = new EventEmitter<number | string>();
  @Output() toggleFavorite = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number | string>();

  readonly authService = inject(AuthService);
  showFullDescription = signal(false);
  quantity = signal(1);

  get detailsLink(): string[] {
    return [this.detailRoute, String(this.product.id)];
  }

  onCartClick(): void {
    if (this.isInCart) {
      this.removeFromCart.emit(this.product.id);
      return;
    }

    if (this.quantity() > 0 && this.quantity() <= this.product.stock) {
      this.addToCart.emit({ product: this.product, quantity: this.quantity() });
      this.quantity.set(1);
    }
  }

  increment(): void {
    if (this.quantity() < this.product.stock) {
      this.quantity.update((v) => v + 1);
    }
  }

  decrement(): void {
    if (this.quantity() > 1) {
      this.quantity.update((v) => v - 1);
    }
  }

  toggleDescription(): void {
    this.showFullDescription.update((v) => !v);
  }

  get isOutOfStock(): boolean {
    return this.product.stock === 0;
  }

  get canAddToCart(): boolean {
    return this.isInCart || (!this.isOutOfStock && this.quantity() <= this.product.stock);
  }
}
