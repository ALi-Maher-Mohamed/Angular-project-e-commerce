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
    readonly products = this.productService.products;

    readonly totalPrice = computed(() =>
        this.cartItems().reduce((sum, item) => {
            const product = this.productService.getById(item.productId);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0),
    );

    onQuantityChange(itemId: number, quantity: number): void {
        const item = this.cartItems().find((current) => current.id === itemId);
        if (!item || quantity < 1) return;
        this.cartService.updateQuantity({ ...item, quantity }).subscribe();
    }

    onRemove(itemId: number): void {
        this.cartService.remove(itemId).subscribe();
    }
}
