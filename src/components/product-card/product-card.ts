import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { Product } from '../../models/product';
import { ShortDescriptionPipe } from '../../pipes/short-description.pipe';
import { ImageZoomDirective } from '../../directives/image-zoom.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ShortDescriptionPipe, ImageZoomDirective, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  @Input() product!: Product;
  @Input() isBought: boolean = false;
  @Output() buy = new EventEmitter<{ product: Product; quantity: number }>();
  @Output() delete = new EventEmitter<number>();

  showFullDescription = signal(false);
  quantity = signal(1);

  onBuy(): void {
    if (this.quantity() > 0 && this.quantity() <= this.product.stock) {
      this.buy.emit({ product: this.product, quantity: this.quantity() });
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

  get canBuy(): boolean {
    return !this.isOutOfStock && this.quantity() <= this.product.stock;
  }
}
