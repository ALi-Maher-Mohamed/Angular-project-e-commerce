import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './cart.html',
    styleUrl: './cart.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
    private cartService = inject(CartService);
    private productService = inject(ProductService);

    readonly cartItems = this.cartService.cartItems;

    getProduct(productId: number | string) {
        return this.productService.getById(productId);
    }

    readonly totalPrice = computed(() =>
        this.cartItems().reduce((sum, item) => {
            const product = this.getProduct(item.productId);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0),
    );

    onQuantityChange(itemId: number | string, quantity: number): void {
        const item = this.cartItems().find((current) => String(current.id) === String(itemId));
        if (!item || quantity < 1) return;
        this.cartService.updateQuantity({ ...item, quantity }).subscribe();
    }

    onRemove(itemId: number | string): void {
        this.cartService.remove(itemId).subscribe();
    }
}
